import { fs, readline } from 'mz';

type FindCriteria<T> = {
    $eq?: T
    $gt?: T
    $lt?: T
    $in?: T[]
}

type RootQuery<T> = {
    $text?: string
    $and?: Query<T>[]
    $or?: Query<T>[]
}

type Query<T> = {
    [P in keyof T]?: P extends string ? FindCriteria<T[P]> : never
} & RootQuery<T>

const getObjectKeys = <T>(o: T) => {
    return Object.keys(o) as (keyof T)[];
}

const isSatisfyQuery = <T>(value: T, q: Query<T>, fullTextSearchFieldNames: Database<T>['fullTextSearchFieldNames']): boolean => {
    return getObjectKeys(q).every(fieldName => {
        if (fieldName === '$and') {
            return q.$and && q.$and.every(andQuery => isSatisfyQuery(value, andQuery, fullTextSearchFieldNames));
        }
        if (fieldName === '$or') {
            return q.$or && q.$or.some(orQuery => isSatisfyQuery(value, orQuery, fullTextSearchFieldNames));
        }
        if (fieldName === '$text') {
            const lookupWords = (q.$text || '').toLowerCase().split(/\s+/);
            return fullTextSearchFieldNames.some(field => {
                const fieldWords = new Set(String(value[field]).toLowerCase().split(/\s+/));
                return lookupWords.every(word => fieldWords.has(word));
            });
        }
        const criteria = q[fieldName];
        if (!criteria) {
            return true
        }

        return getObjectKeys(criteria).every(rule => {
            switch (rule) {
                case '$eq': return value[fieldName] === criteria.$eq;
                case '$gt': return criteria.$gt && value[fieldName] > criteria.$gt;
                case '$lt': return criteria.$lt && value[fieldName] < criteria.$lt;
                case '$in': return criteria.$in && criteria.$in.some(v => v === value[fieldName])
                default: return false;
            }
        })
    })
}

export class Database<T> {
    protected filename: string;
    protected fullTextSearchFieldNames: (keyof T)[];

    constructor(filename: string, fullTextSearchFieldNames: (keyof T)[]) {
        this.filename = filename;
        this.fullTextSearchFieldNames = fullTextSearchFieldNames;
    }

    async find(query: Query<T>): Promise<T[]> {
        const readStream = fs.createReadStream(this.filename);
        const rl = readline.createInterface({
            input: readStream
        })
        const data: T[] = [];
        for await (const line of rl) {
            if (line.startsWith('E')) {
                data.push(JSON.parse(line.substring(1)))
            }
        }

        return data.filter(value => isSatisfyQuery(value, query, this.fullTextSearchFieldNames))
    }
}
