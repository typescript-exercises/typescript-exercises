import {Database} from './database';
import * as path from 'path';
import {expect} from 'chai';

/*

Intro:

    We've grown over 10 users and we should use a serious
    database for admins and users. Such as a text file.
    And it turns out that we should write our own database library.
    Why not, we are a technology company in the end!

Exercise:

    Implement the suggested Database class according to the usage.
    This database should store records, one JSON object each line.
    Each line starts with "E" character which means "Record [E]xists".
    This can be useful for the future when we decide to mark
    records as deleted.
    The Database should only use records starting with "E" and
    ignore all other starting characters.
    Provide the correct typing. Don't use "any".

Run:

    npm run 13

    - OR -

    yarn -s 13

*/

interface User {
    _id: number;
    name: string;
    age: number;
    occupation: string;
    registered: string;
    grades: number[];
}

interface Admin {
    _id: number;
    name: string;
    age: number;
    role: string;
    registered: string;
}

async function testUsersDatabase() {
    const usersDatabase = new Database<User>(path.join(__dirname, 'users.txt'), ['name', 'occupation']);

    // $eq operator means "===", syntax {fieldName: {$gt: value}}
    // see more https://docs.mongodb.com/manual/reference/operator/query/eq/
    expect(
        (await usersDatabase.find({occupation: {$eq: 'Magical entity'}})).map(({_id}) => _id)
    ).to.have.same.members([6, 8]);
    expect((await usersDatabase.find({age: {$eq: 31}, name: {$eq: 'Inspector Gadget'}}))[0]._id).to.equal(5);

    // $gt operator means ">", syntax {fieldName: {$gt: value}}
    // see more https://docs.mongodb.com/manual/reference/operator/query/gt/
    expect((await usersDatabase.find({age: {$gt: 30}})).map(({_id}) => _id)).to.have.same.members([3, 5, 6, 8]);

    // $lt operator means "<", syntax {fieldName: {$lt: value}}
    // see more https://docs.mongodb.com/manual/reference/operator/query/lt/
    expect((await usersDatabase.find({age: {$lt: 30}})).map(({_id}) => _id)).to.have.same.members([0, 2, 4, 7]);

    // Can't use any of these operators with array types.
    expect(
        // @ts-ignore
        (await usersDatabase.find({grades: {$eq: 'Magical entity'}})).map(({_id}) => _id)
    ).to.have.same.members([]);

    // $and condition is satisfied when all the nested conditions are satisfied: {$and: [condition1, condition2, ...]}
    // see more https://docs.mongodb.com/manual/reference/operator/query/and/
    // These examples return the same result:
    //   usersDatabase.find({age: {$eq: 31}, name: {$eq: 'Inspector Gadget'}});
    //   usersDatabase.find({$and: [{age: {$eq: 31}}, {name: {$eq: 'Inspector Gadget'}}]});
    expect(
        (await usersDatabase.find({
            $and: [
                {age: {$gt: 30}},
                {age: {$lt: 40}}
            ]
        })).map(({_id}) => _id)
    ).to.have.same.members([5, 6]);

    // $or condition is satisfied when at least one nested condition is satisfied: {$or: [condition1, condition2, ...]}
    // see more https://docs.mongodb.com/manual/reference/operator/query/or/
    expect(
        (await usersDatabase.find({
            $or: [
                {age: {$gt: 90}},
                {age: {$lt: 30}}
            ]
        })).map(({_id}) => _id)
    ).to.have.same.members([0, 2, 4, 7, 8]);

    // $text operator means full text search. For simplicity this means finding words from the full-text search
    // fields which are specified in the Database constructor. No stemming or language processing other than
    // being case insensitive is not required.
    // Syntax {$text: 'Hello World'} - this return all records having both words in its full-text search fields.
    // It is also possible that queried words are spread among different full-text search fields.
    expect((await usersDatabase.find({$text: 'max'})).map(({_id}) => _id)).to.have.same.members([0, 7]);
    expect((await usersDatabase.find({$text: 'Hey'})).map(({_id}) => _id)).to.have.same.members([]);

    // $in operator checks if entry field value is within the specified list of accepted values.
    // Syntax {fieldName: {$in: [value1, value2, value3]}}
    // Equivalent to {$or: [{fieldName: {$eq: value1}}, {fieldName: {$eq: value2}}, {fieldName: {$eq: value3}}]}
    // see more https://docs.mongodb.com/manual/reference/operator/query/in/
    expect((await usersDatabase.find({_id: {$in: [0, 1, 2]}})).map(({_id}) => _id)).to.have.same.members([0, 2]);
    expect((await usersDatabase.find({age: {$in: [31, 99]}})).map(({_id}) => _id)).to.have.same.members([5, 8]);
}

async function testAdminsDatabase() {
    const adminsDatabase = new Database<Admin>(path.join(__dirname, 'admins.txt'), ['name', 'role']);

    expect(
        (await adminsDatabase.find({role: {$eq: 'Administrator'}})).map(({_id}) => _id)
    ).to.have.same.members([0, 6]);
    expect((await adminsDatabase.find({age: {$eq: 51}, name: {$eq: 'Bill Gates'}}))[0]._id).to.equal(7);

    expect((await adminsDatabase.find({age: {$gt: 30}})).map(({_id}) => _id)).to.have.same.members([0, 2, 3, 6, 7, 8]);

    expect((await adminsDatabase.find({age: {$lt: 30}})).map(({_id}) => _id)).to.have.same.members([5]);

    expect(
        (await adminsDatabase.find({
            $and: [
                {age: {$gt: 30}},
                {age: {$lt: 40}}
            ]
        })).map(({_id}) => _id)
    ).to.have.same.members([0, 8]);

    expect(
        (await adminsDatabase.find({
            $or: [
                {age: {$lt: 30}},
                {age: {$gt: 60}}
            ]
        })).map(({_id}) => _id)
    ).to.have.same.members([2, 5]);

    expect((await adminsDatabase.find({$text: 'WILL'})).map(({_id}) => _id)).to.have.same.members([4, 6]);
    expect((await adminsDatabase.find({$text: 'Administrator'})).map(({_id}) => _id)).to.have.same.members([0, 6]);
    expect((await adminsDatabase.find({$text: 'Br'})).map(({_id}) => _id)).to.have.same.members([]);

    expect((await adminsDatabase.find({_id: {$in: [0, 1, 2, 3]}})).map(({_id}) => _id)).to.have.same.members([0, 2, 3]);
    expect((await adminsDatabase.find({age: {$in: [30, 28]}})).map(({_id}) => _id)).to.have.same.members([4, 5]);

}

Promise.all([
    testUsersDatabase(),
    testAdminsDatabase()
]).then(
    () => console.log('All tests have succeeded, congratulations!'),
    (e) => console.error(e.stack)
);
