/*

Intro:

    Filtering was completely removed from the project.
    It turned out that this feature was just not needed
    for the end-user and we spent a lot of time just because
    our office manager told us to do so. Next time we should
    instead listen to the product management.

    Anyway we have a new plan. CEO's friend Nick told us
    that if we randomly swap user names from time to time
    in the community, it would be very funny and the project
    would definitely succeed!

Exercise:

    Implement swap which receives 2 persons and returns them in
    the reverse order. The function itself is already
    there, actually. We just need to provide it with proper types.
    Also this function shouldn't necessarily be limited to just
    Person types, lets type it so that it works with any two types
    specified.

*/

interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
}

function logUser(user: User) {
    const pos = users.indexOf(user) + 1;
    console.log(` - #${pos} User: ${user.name}, ${user.age}, ${user.occupation}`);
}

function logAdmin(admin: Admin) {
    const pos = admins.indexOf(admin) + 1;
    console.log(` - #${pos} Admin: ${admin.name}, ${admin.age}, ${admin.role}`);
}

const admins: Admin[] = [
    {
        type: 'admin',
        name: 'Will Bruces',
        age: 30,
        role: 'Overseer'
    },
    {
        type: 'admin',
        name: 'Steve',
        age: 40,
        role: 'Steve'
    }
];

const users: User[] = [
    {
        type: 'user',
        name: 'Moses',
        age: 70,
        occupation: 'Desert guide'
    },
    {
        type: 'user',
        name: 'Superman',
        age: 28,
        occupation: 'Ordinary person'
    }
];

export function swap<T1, T2>(v1: T1, v2: T2): [T2, T1] {
    return [v2, v1];
}

function test1() {
    console.log('test1:');
    const [secondUser, firstAdmin] = swap(admins[0], users[1]);
    logUser(secondUser);
    logAdmin(firstAdmin);
}

function test2() {
    console.log('test2:');
    const [secondAdmin, firstUser] = swap(users[0], admins[1]);
    logAdmin(secondAdmin);
    logUser(firstUser);
}

function test3() {
    console.log('test3:');
    const [secondUser, firstUser] = swap(users[0], users[1]);
    logUser(secondUser);
    logUser(firstUser);
}

function test4() {
    console.log('test4:');
    const [firstAdmin, secondAdmin] = swap(admins[1], admins[0]);
    logAdmin(firstAdmin);
    logAdmin(secondAdmin);
}

function test5() {
    console.log('test5:');
    const [stringValue, numericValue] = swap(123, 'Hello World');
    console.log(` - String: ${stringValue}`);
    console.log(` - Numeric: ${numericValue}`);
}

[test1, test2, test3, test4, test5].forEach((test) => test());

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
// https://www.typescriptlang.org/docs/handbook/2/generics.html
