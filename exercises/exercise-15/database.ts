import * as fs from 'fs';
import * as util from 'util';

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

type TFullTextSearchFieldNames<T> = KeysMatching<T, string>[];

type OperatorEq<T> = {
    $eq: T
};
type OperatorGt<T> = {
    $gt: T
};
type OperatorLt<T> = {
    $lt: T
};
type OperatorIn<T> = {
    $in: T[]
};
type Operators<T> = OperatorEq<T> | OperatorGt<T> | OperatorLt<T> | OperatorIn<T>
type OperatorAnd<T> = {
    $and: Expression<T>[]
}
type OperatorOr<T> = {
    $or: Expression<T>[]
}
type OperatorText<T> = {
    $text: string
}
type OperatorField<T> = {
    [K in keyof T]?: Operators<T[K]>
}

type Expression<T> = OperatorAnd<T> | OperatorOr<T> | OperatorText<T> | OperatorField<T>

type SortOption<T> = {
    sort: {
        [K in keyof T]?: 1 | -1
    }
};

type ProjectionOption<T> = {
    projection: {
        [K in keyof T]?: 1
    }
};

type Option<T> = SortOption<T> & ProjectionOption<T> | SortOption<T> | ProjectionOption<T>;

function instanceOfOperatorAnd<T>(expression: Expression<T>): expression is OperatorAnd<T> {
    return expression.hasOwnProperty('$and');
}
function instanceOfOperatorOr<T>(expression: Expression<T>): expression is OperatorOr<T> {
    return expression.hasOwnProperty('$or');
}
function instanceOfOperatorText<T>(expression: Expression<T>): expression is OperatorText<T> {
    return expression.hasOwnProperty('$text');
}
function instanceOfOperatorEq<T>(expression: Operators<T>): expression is OperatorEq<T> {
    return expression.hasOwnProperty('$eq');
}
function instanceOfOperatorGt<T>(expression: Operators<T>): expression is OperatorGt<T> {
    return expression.hasOwnProperty('$gt');
}
function instanceOfOperatorLt<T>(expression: Operators<T>): expression is OperatorLt<T> {
    return expression.hasOwnProperty('$lt');
}
function instanceOfOperatorIn<T>(expression: Operators<T>): expression is OperatorIn<T> {
    return expression.hasOwnProperty('$in');
}

function instanceOfSortOption<T>(option: Option<T>): option is SortOption<T> {
    return option.hasOwnProperty('sort');
}
function instanceOfProjectionOption<T>(option: Option<T>): option is ProjectionOption<T> {
    return option.hasOwnProperty('projection');
}

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

export class Database<T> {
    protected filename: string;
    protected fullTextSearchFieldNames: TFullTextSearchFieldNames<T>;

    constructor(filename: string, fullTextSearchFieldNames: TFullTextSearchFieldNames<T>) {
        this.filename = filename;
        this.fullTextSearchFieldNames = fullTextSearchFieldNames;
    }

    protected match(obj: T, query: Expression<T>): boolean {
        if (instanceOfOperatorAnd(query)) {
            for (let subquery of query.$and) {
                if (!this.match(obj, subquery))
                    return false;
            }
            return true;
        }
        else if (instanceOfOperatorOr(query)) {
            for (let subquery of query.$or) {
                if (this.match(obj, subquery)) 
                    return true;
            }
            return false;
        }
        else if (instanceOfOperatorText(query)) {
            let words = query.$text.toLowerCase().split(' ');
            let check = Array.from({length: words.length}, (v, i) => false);
            for (let field of this.fullTextSearchFieldNames) {
                let fieldValue = obj[field] as unknown as string;
                let fieldWords = fieldValue.toLowerCase().split(' ');
                for (let i = 0; i < words.length; i++) {
                    if (check[i])
                        continue;
                    for (let fieldWord of fieldWords) {
                        if (fieldWord == words[i]) {
                            check[i] = true;
                            break;
                        }
                    }
                }
            }
            return !check.includes(false);
        }
        else {
            for (let [key, value] of Object.entries(query)) {
                let operator = value as Operators<T[keyof T]>;
                let obj_key = key as keyof T;
                if (instanceOfOperatorEq(operator)) {
                    if (!(obj[obj_key] === operator.$eq))
                        return false;
                }
                else if (instanceOfOperatorGt(operator)) {
                    if (!(obj[obj_key] > operator.$gt))
                        return false;
                }
                else if (instanceOfOperatorLt(operator)) {
                    if (!(obj[obj_key] < operator.$lt))
                        return false;
                }
                else if (instanceOfOperatorIn(operator)) {
                    if (!(operator.$in.includes(obj[obj_key])))
                        return false;
                }
            }
            return true;
        }
    }

    protected handleOption(input: T[], option?: Option<T>): (typeof option) extends ProjectionOption<T> ? Partial<T>[] : T[] {
        let result = input;
        if (option == undefined)
            return result;
        if (instanceOfSortOption(option)) {
            let sortRule = Object.entries(option.sort) as [keyof T, 1 | -1][];
            result.sort((_a, _b) => {
                for (let [k, v] of sortRule) {
                    let a = _a, b = _b;
                    if (v == -1) {
                        [a, b] = [b, a];
                    }
                    if (a[k] < b[k])
                        return -1;
                    else if (a[k] > b[k])
                        return 1;
                }
                return 0;
            });
        }
        if (instanceOfProjectionOption(option)) {
            let a = result.map((obj) => {
                let keys = Object.keys(option.projection) as (keyof T)[];
                let newobj = {} as Partial<T>;
                for (let key of keys) {
                    newobj[key] = obj[key];
                }
                return newobj;
            });
            return a as any; //https://github.com/microsoft/TypeScript/issues/24929
        }
        return result;
    }

    async find(query: Expression<T>, option?: Option<T>): Promise<(typeof option) extends ProjectionOption<T> ? Partial<T>[] : T[]> {
        return readFile(this.filename).then((result) => 
            result.toString('utf-8')
                    .split('\r\n')
                    .filter((text)=>text.startsWith('E'))
                    .map(text => JSON.parse(text.substring(1)) as T)
                    .filter(obj => this.match(obj, query))).then(result =>
                        this.handleOption(result, option));
    }

    async delete(query: Expression<T>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let result = fs.readFileSync(this.filename);
            let newdata = result.toString('utf-8')
                    .split('\r\n')
                    .filter((text)=>text.startsWith('E'))
                    .map((text) => {
                        if (text.length <= 1) return text;
                        let obj = JSON.parse(text.substring(1)) as T;
                        if (this.match(obj, query))
                            return 'D' + text.substring(1);
                        return text;
                    }).join('\r\n');
            if (newdata.length !== 0 && !newdata.endsWith('\r\n')) {
                newdata += '\r\n';
            }
            fs.writeFileSync(this.filename, newdata);
            resolve();
        });
    }

    async insert(newRecord: T): Promise<void> {
        let appendText = 'E' + JSON.stringify(newRecord) + '\r\n';

        return appendFile(this.filename, appendText);
    }
}
