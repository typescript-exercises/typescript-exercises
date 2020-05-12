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
};
type Expression<T> = OperatorAnd<T> | OperatorOr<T> | OperatorText<T> | OperatorField<T>

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


const readFile = util.promisify(fs.readFile);

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

    async find(query: Expression<T>): Promise<T[]> {
        return readFile(this.filename).then((result) => 
            result.toString('utf-8')
                    .split('\r\n')
                    .filter((text)=>text.startsWith('E'))
                    .map(text => JSON.parse(text.substring(1)) as T)
                    .filter(obj => this.match(obj, query)));
    }
}
