import * as fs from 'fs';

type JsonScalar = boolean | number | string;

export type FieldOp = |
    {$eq: JsonScalar} |
    {$gt: JsonScalar} |
    {$lt: JsonScalar} |
    {$in: JsonScalar[]};

export type Query<T extends object> = |
    {$and: Query<T>[]} |
    {$or: Query<T>[]} |
    {$text: string} |
    (
        {[field in QueryableKeys<T>]?: FieldOp}
    );

function matchOp(op: FieldOp, v: JsonScalar) {
    if ('$eq' in op) {
        return v === op['$eq'];
    } else if ('$gt' in op) {
        return v > op['$gt'];
    } else if ('$lt' in op) {
        return v < op['$lt'];
    } else if ('$in' in op) {
        return op['$in'].includes(v);
    }
    throw new Error(`Unrecognized op: ${op}`);
}

type IndexedRecord<T extends object> = T & {
    $index: {[word: string]: true};
};

type Unionize<T extends object> = {[k in keyof T]: {k: k, v: T[k]}}[keyof T];
type QueryableKeys<T extends object> = Extract<Unionize<T>, {v: JsonScalar}>['k'];

function matches<T extends object>(
    q: Query<T>,
    r: IndexedRecord<T>
): boolean {
    if ('$and' in q) {
        return q.$and!.every(subq => matches(subq, r));
    } else if ('$or' in q) {
        return q.$or!.some(subq => matches(subq, r));
    } else if ('$text' in q) {
        const words = q.$text!.toLowerCase().split(' ');
        return words.every(w => r.$index[w]);
    }
    return Object.entries(q).every(
        ([k, v]) => matchOp(v as FieldOp, r[k as keyof T] as any)
    );
}

export type Options<T> = {
    sort?: {[k in keyof T]?: -1 | 1};
    projection?: {[k in keyof T]?: 1}
};

function typedItems<T extends object>(o: T): [keyof T, T[keyof T]][] {
    return Object.entries(o) as any;
}

function project<T extends object, K extends keyof T>(o: T, p: {[k in K]?: 1}): {[k in K]: T[k]} {
    let out: Partial<T> = {};
    for (const k in p) {
        out[k] = o[k];
    }
    return out as any;
}

export class Database<T extends object> {
    protected filename: string;
    protected fullTextSearchFieldNames: (keyof T)[];
    protected records: IndexedRecord<T>[];

    constructor(filename: string, fullTextSearchFieldNames: (keyof T)[]) {
        this.filename = filename;
        this.fullTextSearchFieldNames = fullTextSearchFieldNames;

        const text = fs.readFileSync(filename, 'utf8');
        const lines = text.split('\n');
        this.records = lines
            .filter(line => line.startsWith('E'))
            .map(line => JSON.parse(line.slice(1)))
            .map(obj => {
                obj.$index = {};
                for (const f of fullTextSearchFieldNames) {
                    const text = obj[f];
                    for (const word of text.split(' ')) {
                        obj.$index[word.toLowerCase()] = true;
                    }
                }
                return obj;
            });
    }

    async find(query: Query<T>, options?: Options<T>): Promise<Partial<T>[]> {
        let rs = this.records.filter(r => matches(query, r));
        if (options) {
            const {sort, projection} = options;
            for (const [k, v] of typedItems(sort || {})) {
                rs.sort((r1, r2) => r1[k] > r2[k] ? v : r1[k] === r2[k] ? 0 : -v);
            }
            if (projection) {
                return rs.map(r => project(r, projection));
            }
        }
        return rs;
    }
}
