import * as fs from 'fs'
import * as readlines from 'readline'

export class Database<T extends { _id: number }> {
    protected filename: string
    protected fullTextSearchFieldNames: (keyof Partial<T>)[]
    protected rawDB: Promise<string[]>

    constructor(filename: string, fullTextSearchFieldNames: (keyof Partial<T>)[]) {
        this.filename = filename
        this.fullTextSearchFieldNames = fullTextSearchFieldNames
        this.rawDB = this.readDBRaw()
    }

    async delete(query: Query<T>): Promise<void> {
        const foundIDs = (await this.find(query)).map((e) => e._id)
        const reverseSortedIDs = foundIDs.sort((a, b) => b - a)
        const rawDB = await this.rawDB
        reverseSortedIDs.forEach((id) => {
            // who needs data validation anyways
            rawDB[id] = `D${rawDB[id].slice(1)}`
        })
        this.rawDB = Promise.resolve(rawDB)
        await this.writeDBRaw()
    }

    async insert(element: T): Promise<void> {
        const rawDB = await this.rawDB
        rawDB.push(`E${JSON.stringify(element)}`)
        this.rawDB = Promise.resolve(rawDB)
        await this.writeDBRaw()
    }

    async find(query: Query<T>): Promise<(Omit<Partial<T>, '_id'> & { _id: number })[]>
    async find(query: Query<T>, options: Options<T>): Promise<Partial<T>[]>
    async find(query: Query<T>, options?: Options<T>): Promise<Partial<T>[]> {
        const predicate = this.predicateFromQuery(query)
        // we could keep a decoded set of the db in memory as an improvement
        let result = this.decodeDB(await this.rawDB).filter(predicate)
        const sort = options?.sort
        if (sort) {
            result = this.sort(result, sort)
        }
        const projection = options?.projection
        if (projection) {
            return this.project(result, projection)
        }
        return result
    }

    sort(elements: T[], sortOptions: Sort<T>): T[] {
        // TODO only first sort element since more are not used in the test cases
        const [sortKey, sortOrder] = this.destructureSortOptions(sortOptions)[0]
        return elements.sort((a, b) => (a[sortKey] > b[sortKey] ? sortOrder : -sortOrder))
    }

    destructureSortOptions<K extends keyof T = keyof T>(sortOptions: Sort<T>): [K, 1 | -1][] {
        return Object.entries(sortOptions) as [K, 1 | -1][]
    }

    project(elements: T[], projectionOptions: Projection<T>): Partial<T>[] {
        return elements.map((e) =>
            (Object.keys(projectionOptions) as (keyof T)[]).reduce((result, k) => {
                result[k] = e[k]
                return result
            }, {} as Partial<T>)
        )
    }

    predicateFromQuery(query: Query<T>): (element: T) => boolean {
        return (element) => {
            if (isAndQuery(query)) {
                return query.$and.map((query) => this.predicateFromQuery(query)(element)).every(Boolean)
            } else if (isOrQuery(query)) {
                return query.$or.map((query) => this.predicateFromQuery(query)(element)).some(Boolean)
            } else if (isTextQuery(query)) {
                return this.fullTextSearchFieldNames
                    .map((fieldName) => `${element[fieldName]}`.split(' '))
                    .some((tokens) => tokens.some((value) => value.toLowerCase() === query.$text.toLowerCase()))
            } else if (isEmptyQuery(query)) {
                return true
            } else if (isFieldQuery(query)) {
                const [field, comparator] = this.destructureFieldQuery(query)
                if (isEqComparator(comparator)) {
                    return element[field] === comparator.$eq
                } else if (isGtComparator(comparator)) {
                    return element[field] > comparator.$gt
                } else if (isLtComparator(comparator)) {
                    return element[field] < comparator.$lt
                } else if (isInComparator(comparator)) {
                    return comparator.$in.includes(element[field])
                }
                return false
            }
            return false
        }
    }

    destructureFieldQuery<K extends keyof T = keyof T>(fieldQuery: FieldQuery<T>): [K, Comparator<T[K]>] {
        return Object.entries(fieldQuery)[0] as [K, Comparator<T[K]>]
    }

    decodeDB(rawDB: string[]): T[] {
        return rawDB.reduce((parsedElements, currentLine) => {
            if (currentLine.startsWith('E')) {
                const jsonString = currentLine.slice(1)
                const parsedElement = JSON.parse(jsonString) as T
                parsedElements.push(parsedElement)
            }
            return parsedElements
        }, [] as T[])
    }

    async readDBRaw(): Promise<string[]> {
        const fileStream = fs.createReadStream(this.filename)
        const rl = readlines.createInterface({ input: fileStream, crlfDelay: Infinity })
        let lines: string[] = []
        for await (const line of rl) {
            lines.push(line)
        }
        return lines
    }

    async writeDBRaw(): Promise<void> {
        let resolve: () => void
        const p = new Promise<void>((res: typeof resolve) => {
            resolve = res
        })
        const callback = () => {
            resolve()
        }
        fs.writeFile(this.filename, (await this.rawDB).join('\n'), callback)
        return p
    }
}

type Query<T> = FieldQuery<T> | {} | AndQuery<T> | OrQuery<T> | TextQuery<T>

type FieldQuery<T, K extends keyof T = keyof T> = K extends string ? { [k in K]: Comparator<T[K]> } : never
// type FieldQuery<T, K extends keyof T = keyof T> = Partial<{ [K in keyof T]: Comparator<T[K]> }>

type AndQuery<T> = { $and: Query<T>[] }
type OrQuery<T> = { $or: Query<T>[] }
type TextQuery<T> = { $text: string }

type Comparator<Value> = EqComparator<Value> | GtComparator<Value> | LtComparator<Value> | InComparator<Value>
type EqComparator<Value> = { $eq: Value }
type GtComparator<Value> = { $gt: Value }
type LtComparator<Value> = { $lt: Value }
type InComparator<Value> = { $in: Value[] }

const isFieldQuery = <T>(query: Query<T>): query is FieldQuery<T> => !isAndQuery(query) && !isOrQuery(query) && !isTextQuery(query) && !isEmptyQuery(query)
const isAndQuery = <T>(query: Query<T>): query is AndQuery<T> => '$and' in query
const isOrQuery = <T>(query: Query<T>): query is OrQuery<T> => '$or' in query
const isTextQuery = <T>(query: Query<T>): query is TextQuery<T> => '$text' in query
const isEmptyQuery = <T>(query: Query<T>): query is {} => Object.keys(query).length === 0

const isEqComparator = <Value>(comparator: Comparator<Value>): comparator is EqComparator<Value> => '$eq' in comparator
const isGtComparator = <Value>(comparator: Comparator<Value>): comparator is GtComparator<Value> => '$gt' in comparator
const isLtComparator = <Value>(comparator: Comparator<Value>): comparator is LtComparator<Value> => '$lt' in comparator
const isInComparator = <Value>(comparator: Comparator<Value>): comparator is InComparator<Value> => '$in' in comparator

type Options<T> = {
    sort?: Sort<T>
    projection?: Projection<T>
}
type Sort<T, K extends keyof T = keyof T> = K extends string ? { [k in K]: 1 | -1 } : never
// type Sort<T> = Partial<{ [K in keyof T]: 1 | -1 }>
type Projection<T> = Partial<{ [K in keyof T]: 1 }>
