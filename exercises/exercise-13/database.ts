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

    async find(query: Query<T>): Promise<T[]> {
        return this.records.filter(r => matches(query, r));
    }
}
