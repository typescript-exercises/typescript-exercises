import {readFile} from 'fs';


type FieldQuery<FT> = 
    | {$eq: FT}
    | {$lt: FT}
    | {$gt: FT}
    | {$in: FT[]}

type Query<T extends {}> = {[K in keyof T]?: FieldQuery<T[K]>} & {
    $text?: string;
    $and?: Query<T>[];
    $or?: Query<T>[];
}

interface Documents {
    [key: string]: boolean;
}

function intersectSearchResults(documents: Documents[]) {
    const results: Documents = {}
    if (documents.length === 0) {
        return results
    }

    for(let key of Object.keys(documents[0])) {
        let keep = true;
        for (let i = 0; i < documents.length; i++) {
            if (!documents[i][key]) {
                keep = false;
                break;
            }
        }

        if (keep) {
            results[key] = true;
        }
    }

    return results;

}

function mergeSearchResults(documents: Documents[]) {
    const results: Documents = {};
    for (const document of documents) {
        for (const key of Object.keys(document)) {
            results[key] = true
        }
    }

    return results
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
                .map((index) => documents[index])
    }

    protected getDocuments() {
        return this.getDocumentsPromise || (new Promise((resolve, reject) => {
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
        }))
    }

    protected getFullTextSearchIndex() {
        return this.getFullTextSearchIndexPromise || this.getDocuments().then((documents) => {
            const fullTextSearchIndex = new FullTextSearchIndex();
            documents.forEach((document, index) => {
                fullTextSearchIndex.addDocument(
                    index,
                    this.fullTextSearchFieldNames.map((key) => String(document[key]))
                );
            })
            return fullTextSearchIndex;
        })
    }

    protected async getMatchingDocumentsIds(comparator: (document: T) => boolean) {
        const result: Documents = {};
        const documents = await this.getDocuments();
        for(let i = 0; i < documents.length; i++) {
            if (comparator(documents[i])) {
                result[i] = true;
            }
        }
        return result;
    }

    protected async findMatchingDocuments(query: Query<T>) : Promise<Documents>{
        const result: Documents[] = [];

        for (const key of Object.keys(query) as (keyof Query<T>)[]) {
            if (key === '$text') {
                result.push((await this.getFullTextSearchIndex()).search(query.$text!))
            } else if (key === '$and') {
                // 链式调用
                result.push(
                    intersectSearchResults(await Promise.all(query.$and!.map(this.findMatchingDocuments, this)))
                );
            } else if (key === '$or') {
                result.push(mergeSearchResults(await Promise.all(query.$or!.map(this.findMatchingDocuments, this))));
            } else {
                const fieldQuery = query[key] as FieldQuery<unknown>
                if ('$eq' in fieldQuery) {
                    result.push(await this.getMatchingDocumentsIds((document) => document[key] === fieldQuery.$eq))
                } else if ('$gt' in fieldQuery) {
                    result.push(await this.getMatchingDocumentsIds((document) => Number(document[key]) > Number(fieldQuery.$gt)))
                } else if ('$lt' in fieldQuery) {
                    result.push(await this.getMatchingDocumentsIds((document) => Number(document[key]) < Number(fieldQuery.$lt)))
                } else if ('$in' in fieldQuery) {
                    const index: {[key: string] : boolean} = {}
                    for(const value of fieldQuery.$in) {
                        index[String(value)] = true;
                    }
                    result.push(await this.getMatchingDocumentsIds((document) => index.hasOwnProperty(String(document[key]))))
                } else {
                    throw new Error('Incorrect query')
                }
            }
        }

        return intersectSearchResults(result)
    }
}

class FullTextSearchIndex {
    protected wordsToDocuments: {[words: string]: Documents} = {}

    protected breakTextIntowords (text: string) {
        return text.toLowerCase().replace(/\W+/g, ' ').trim().split(' ');
    }


    addDocument(documentIndex: number, texts: string[]) {
        for(const text of texts) {
            const words = this.breakTextIntowords(text);
            for(let word of words) {
                this.wordsToDocuments[word] = this.wordsToDocuments[word] || {};
                this.wordsToDocuments[word][documentIndex] = true;
            }
        }
    }

    search(query: string): Documents {
        return intersectSearchResults(
            this.breakTextIntowords(query)
                .map((word) => this.wordsToDocuments[word])
                .filter(Boolean)
        )
    }
}

