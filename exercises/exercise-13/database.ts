export class Database<T> {
    protected filename: string;
    protected fullTextSearchFieldNames: unknown[];

    constructor(filename: string, fullTextSearchFieldNames) {
        this.filename = filename;
        this.fullTextSearchFieldNames = fullTextSearchFieldNames;
    }

    async find(query): Promise<T[]> {
        return [];
    }
}
