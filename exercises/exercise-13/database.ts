import * as fs from 'fs';

export type FieldOp = |
    {$eq: string | number} |
    {$gt: string | number} |
    {$lt: string | number} |
    {$in: (string | number)[]};

export type Query = |
    {$and: Query[]} |
    {$or: Query[]} |
    {$text: string} |
    (
        {[field: string]: FieldOp}
        & {$and?: never; $or?: never; $text?: never}
    );

function matchOp(op: FieldOp, v: any) {
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

function matches(q: Query, r: unknown): boolean {
    if ('$and' in q) {
        return q.$and!.every(subq => matches(subq, r));
    } else if ('$or' in q) {
        return q.$or!.some(subq => matches(subq, r));
    } else if ('$text' in q) {
        const words = q.$text!.toLowerCase().split(' ');
        return words.every(w => (r as any).$index[w]);
    }
    return Object.entries(q).every(([k, v]) => matchOp(v, (r as any)[k]));
}

export class Database<T> {
    protected filename: string;
    protected fullTextSearchFieldNames: string[];
    protected records: T[];

    constructor(filename: string, fullTextSearchFieldNames: string[]) {
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

    async find(query: Query): Promise<T[]> {
        return this.records.filter(r => matches(query, r));
    }
}
