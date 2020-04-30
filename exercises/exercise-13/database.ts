import {readFile} from 'fs';

type FieldQuery<FT> =
    | {$eq: FT}
    | {$gt: FT}
    | {$lt: FT}
    | {$in: FT[]};

type Query<T extends {}> = {[K in keyof T]?: FieldQuery<T[K]>} & {
    $text?: string;
    $and?: Query<T>[];
    $or?: Query<T>[];
};

interface Documents {
    [key: string]: boolean;
}

function intersectSearchResults(documents: Documents[]) {
    const result: Documents = {};
    if (documents.length === 0) {
        return result;
    }
    for (let key of Object.keys(documents[0])) {
        let keep = true;
        for (let i = 1; i < documents.length; i++) {
            if (!documents[i][key]) {
                keep = false;
                break;
            }
        }
        if (keep) {
            result[key] = true;
        }
    }
    return result;
}

function mergeSearchResults(documents: Documents[]) {
    const result: Documents = {};
    for (const document of documents) {
        for (const key of Object.keys(document)) {
            result[key] = true;
        }
    }
    return result;
}

export class Database<T> {
    protected filename: string;
    protected fullTextSearchFieldNames: (keyof T)[];
    protected getDocumentsPromise: Promise<T[]> | null = null;
    protected getFullTextSearchIndexPromise: Promise<FullTextSearchIndex> | null = null;

    constructor(filename: string, fullTextSearchFieldNames: (keyof T)[]) {
        this.filename = filename;
        this.fullTextSearchFieldNames = fullTextSearchFieldNames;
    }

    async find(query: Query<T>): Promise<T[]> {
        const documents = await this.getDocuments();
        return Object.keys(await this.findMatchingDocuments(query))
            .map(Number)
            .map((index) => documents[index]);
    }

    protected getDocuments() {
        return this.getDocumentsPromise || (this.getDocumentsPromise = new Promise((resolve, reject) => {
            readFile(this.filename, 'utf8', (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(
                    data
                        .trim()
                        .split('\n')
                        .filter((line) => line[0] === 'E')
                        .map((line) => JSON.parse(line.substr(1)))
                );
            });
        }));
    }

    protected getFullTextSearchIndex() {
        return this.getFullTextSearchIndexPromise || (
            this.getFullTextSearchIndexPromise = this.getDocuments().then((documents) => {
                const fullTextSearchIndex = new FullTextSearchIndex();
                documents.forEach((document, id) => {
                    fullTextSearchIndex.addDocument(
                        id,
                        this.fullTextSearchFieldNames.map((key) => String(document[key]))
                    );
                });
                return fullTextSearchIndex;
            })
        );
    }

    protected async getMatchingDocumentIds(comparator: (document: T) => boolean) {
        const result: Documents = {};
        const documents = await this.getDocuments();
        for (let i = 0; i < documents.length; i++) {
            if (comparator(documents[i])) {
                result[i] = true;
            }
        }
        return result;
    }

    protected async findMatchingDocuments(query: Query<T>): Promise<Documents> {
        const result: Documents[] = [];
        for (const key of Object.keys(query) as (keyof Query<T>)[]) {
            if (key === '$text') {
                result.push((await this.getFullTextSearchIndex()).search(query.$text!))
            } else if (key === '$and') {
                result.push(
                    intersectSearchResults(await Promise.all(query.$and!.map(this.findMatchingDocuments, this)))
                );
            } else if (key === '$or') {
                result.push(mergeSearchResults(await Promise.all(query.$or!.map(this.findMatchingDocuments, this))));
            } else {
                const fieldQuery = query[key] as FieldQuery<unknown>;
                if ('$eq' in fieldQuery) {
                    result.push(await this.getMatchingDocumentIds((document) => document[key] === fieldQuery.$eq));
                } else if ('$gt' in fieldQuery) {
                    result.push(
                        await this.getMatchingDocumentIds((document) => Number(document[key]) > Number(fieldQuery.$gt))
                    );
                } else if ('$lt' in fieldQuery) {
                    result.push(
                        await this.getMatchingDocumentIds((document) => Number(document[key]) < Number(fieldQuery.$lt))
                    );
                } else if ('$in' in fieldQuery) {
                    const index: {[key: string]: boolean} = {};
                    for (const val of fieldQuery.$in) {
                        index[String(val)] = true;
                    }
                    result.push(
                        await this.getMatchingDocumentIds((document) => index.hasOwnProperty(String(document[key])))
                    );
                } else {
                    throw new Error('Incorrect query.');
                }
            }
        }
        return intersectSearchResults(result);
    }
}

class FullTextSearchIndex {
    protected wordsToDocuments: {[word: string]: Documents} = {};

    protected breakTextIntoWords(text: string) {
        return text.toLowerCase().replace(/\W+/g, ' ').trim().split(' ');
    }

    addDocument(document: number, texts: string[]) {
        for (const text of texts) {
            const words = this.breakTextIntoWords(text);
            for (let word of words) {
                this.wordsToDocuments[word] = this.wordsToDocuments[word] || {};
                this.wordsToDocuments[word][document] = true;
            }
        }
    }

    search(query: string): Documents {
        return intersectSearchResults(
            this.breakTextIntoWords(query)
                .map((word) => this.wordsToDocuments[word])
                .filter(Boolean)
        );
    }
}
