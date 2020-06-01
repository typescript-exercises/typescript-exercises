import * as fs from 'fs'
import * as readlines from 'readline'

export class Database<T> {
    protected filename: string
    protected fullTextSearchFieldNames: (keyof Partial<T>)[]

    constructor(filename: string, fullTextSearchFieldNames: (keyof Partial<T>)[]) {
        this.filename = filename
        this.fullTextSearchFieldNames = fullTextSearchFieldNames
    }

    async find(query: Query<T>): Promise<T[]> {
        const db = await this.decodeDB()
        const predicate = this.predicateFromQuery(query)
        return db.filter(predicate)
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

    async decodeDB(): Promise<T[]> {
        return (await this.readDBRaw()).reduce((parsedElements, currentLine) => {
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
}

type Query<T> = FieldQuery<T> | AndQuery<T> | OrQuery<T> | TextQuery<T>

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

const isFieldQuery = <T>(query: Query<T>): query is FieldQuery<T> => !isAndQuery(query) && !isOrQuery(query) && !isTextQuery(query)
const isAndQuery = <T>(query: Query<T>): query is AndQuery<T> => '$and' in query
const isOrQuery = <T>(query: Query<T>): query is OrQuery<T> => '$or' in query
const isTextQuery = <T>(query: Query<T>): query is TextQuery<T> => '$text' in query

const isEqComparator = <Value>(comparator: Comparator<Value>): comparator is EqComparator<Value> => '$eq' in comparator
const isGtComparator = <Value>(comparator: Comparator<Value>): comparator is GtComparator<Value> => '$gt' in comparator
const isLtComparator = <Value>(comparator: Comparator<Value>): comparator is LtComparator<Value> => '$lt' in comparator
const isInComparator = <Value>(comparator: Comparator<Value>): comparator is InComparator<Value> => '$in' in comparator
