import {Database} from './database';
import * as path from 'path';
import {expect} from 'chai';

/*

Intro:

    The database was a huge success in the company.
    CEO's friend Nick told us that he's now ready to invest
    all the money that he was saving for his daughter's college.
    The only condition is that we drop everything we did before
    and focus on the database implementation.
    Sounds good to us, we never cared about the community anyways.

Exercise:

    Feel free to copy-paste your previous Database implementation to start with.

    Extend find method with a new optional "options" argument which
    has two optional fields:
        - sort: when specified, sorts results accordingly.
              Format: {fieldName1: 1 | -1, fieldName2: 1 | -1, ...}
                  1  - Ascending sort
                  -1 - Descending sort
              Example:
                usersDatabase.find(
                    {age: {$gt: 20}},
                    {sort: {age: 1, name: 1}}
                ); // Sorts by age and then by name both in ascending order
                usersDatabase.find(
                    {},
                    {sort: {registered: -1}}
                ); // Sorts by registered date in descending order
        - projection: when specified, returns only specified fields for each record.
              Format: {fieldName1: 1, fieldName2: 1, ...}
              Example:
                usersDatabase.find(
                    {age: {$gt: 20}},
                    {projection: {name: 1, age: 1}}
                ); // -> returns {name: string, age: number}[]
                usersDatabase.find(
                    {age: {$gt: 20}},
                    {projection: {age: 1, occupation: 1}}
                ); // -> returns {age: number, occupation: string}[]

    Provide the correct typing. Don't use "any".

Run:

    npm run 14

    - OR -

    yarn -s 14

*/

interface User {
    _id: number;
    name: string;
    age: number;
    occupation: string;
    registered: string;
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

    expect(await usersDatabase.find({age: {$eq: 31}, name: {$eq: 'Inspector Gadget'}}, {projection: {occupation: 1}}))
        .to.eql([{occupation: 'Undercover'}]);
    expect(await usersDatabase.find({}, {projection: {name: 1, occupation: 1}, sort: {_id: 1}}))
        .to.eql([
            {"name": "Max Mustermann", "occupation": "Chimney sweep"},
            {"name": "Kate Müller", "occupation": "Astronaut"},
            {"name": "Moses", "occupation": "Desert guide"},
            {"name": "Superman", "occupation": "Ordinary person"},
            {"name": "Inspector Gadget", "occupation": "Undercover"},
            {"name": "Genius", "occupation": "Magical entity"},
            {"name": "Max Pax", "occupation": "SC2 Expert"},
            {"name": "Maximum Impact", "occupation": "Magical entity"}
        ]);
    expect((await usersDatabase.find({age: {$gt: 30}}, {sort: {age: 1}})).map(({_id}) => _id)).to.eql([5, 6, 3, 8]);
}

async function testAdminsDatabase() {
    const adminsDatabase = new Database<Admin>(path.join(__dirname, 'admins.txt'), ['name', 'role']);

    expect((await adminsDatabase.find({role: {$eq: 'Administrator'}}, {projection: {name: 1, role: 1}})))
        .to.have.same.deep.members([
            {name: 'Jane Doe', role: 'Administrator'},
            {name: 'Will Smith', role: 'Administrator'}
        ]);
    expect(await adminsDatabase.find({age: {$gt: 40}}, {projection: {name: 1}, sort: {age: 1}}))
        .to.have.same.deep.members([
            {"name": "Will Smith"},
            {"name": "Bill Gates"},
            {"name": "Bruce Willis"}
        ]);
}

Promise.all([
    testUsersDatabase(),
    testAdminsDatabase()
]).then(
    () => console.log('All tests have succeeded, congratulations!'),
    (e) => console.error(e.stack)
);
