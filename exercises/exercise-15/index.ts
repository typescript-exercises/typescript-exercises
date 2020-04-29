import {Database} from './database';
import * as path from 'path';
import {promises as fs} from 'mz/fs';
import {expect} from 'chai';

/*

Intro:

    CEO's friend Nick told us that databases don't only store static
    data, but also provide API for adding new data and modifying
    existing data. That was completely unexpected from us.
    After drinking hard for a week we decided to move forward.

Exercise:

    Feel free to copy-paste your previous Database implementation to start with.

    Define and implement two new methods in the database:
        - delete(query)
            Deletes all records by the specified query.
            Query follows the same format from the find method.
            This method should modify the contents of the database
            file by changing "E" flag to "D" of the corresponding
            records.
        - insert(newRecord)
            Inserts a new record into the database. This method
            should modify the contents of the database file by
            appending a record to the end of the file.

Run:

    npm run 15

    - OR -

    yarn -s 15

*/

interface User {
    _id: number;
    name: string;
    age: number;
    occupation: string;
}

async function testUsersDatabase() {
    await fs.copyFile(path.join(__dirname, 'initial-users.txt'), path.join(__dirname, 'users.txt'));

    const usersDatabase = new Database<User>(path.join(__dirname, 'users.txt'), ['name', 'occupation']);

    await usersDatabase.insert({
        _id: 9,
        name: 'Amelie Roach',
        occupation: 'PR',
        age: 23
    });

    expect(
        await usersDatabase.find({_id: {$eq: 9}}, {projection: {name: 1}})
    ).to.eql([{name: 'Amelie Roach'}]);

    await Promise.all([
        usersDatabase.find({_id: {$eq: 2}}).then(([user]) => expect(user.occupation).to.equal('Astronaut')),
        usersDatabase.delete({_id: {$eq: 0}}),
        usersDatabase.insert({
            _id: 10,
            name: 'Luc Hook',
            occupation: 'Homeless',
            age: 44
        }),
        usersDatabase.insert({
            _id: 11,
            name: 'Arnold Schwarzenegger',
            occupation: 'Actor',
            age: 64
        }),
        usersDatabase.insert({
            _id: 12,
            name: 'Silvester Stallone',
            occupation: 'Actor',
            age: 63
        })
    ]);

    expect(
        await usersDatabase.find({occupation: {$eq: 'Actor'}}, {sort: {age: 1}, projection: {_id: 1}})
    ).to.eql([{_id: 12}, {_id: 11}]);

    expect(
        (await usersDatabase.find({}, {sort: {_id: -1}, projection: {_id: 1}})).map(({_id}) => _id)
    ).to.eql([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

    await usersDatabase.delete({_id: {$gt: 5}});

    expect(
        (await usersDatabase.find({}, {sort: {_id: -1}, projection: {_id: 1}})).map(({_id}) => _id)
    ).to.eql([5, 4, 3, 2]);
}

testUsersDatabase().then(
    () => console.log('All tests have succeeded, congratulations!'),
    (e) => console.error(e.stack)
);
