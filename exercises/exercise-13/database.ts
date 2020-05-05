const path = require('path');
import { readFileSync } from 'fs';

type QueryCondition<T> =
  | {
      $eq: any;
    }
  | {
      $gt: any;
    }
  | {
      $lt: any;
    }
  | {
      $and: any;
    }
  | {
      $or: any;
    }
  | {
      $text: any;
    }
  | {
      $in: any;
    };

type Query<T> = {
  [P in keyof T]: { [K in keyof QueryCondition<T>]: any };
};

export class Database<T> {
  protected filename: string;
  protected fullTextSearchFieldNames: string[];
  protected records: T[];

  constructor(filename: string, fullTextSearchFieldNames: string[]) {
    this.filename = filename;
    this.fullTextSearchFieldNames = fullTextSearchFieldNames;
    this.records = readFileSync(filename)
      .toString()
      .split('\n')
      .filter((_) => _.startsWith('E'))
      .map((_) => JSON.parse(_.slice(1)));
    console.log(this.records);
  }

  async find(query: Query<T>): Promise<T[]> {
    return [];
  }
}
