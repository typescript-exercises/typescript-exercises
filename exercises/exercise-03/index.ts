import chalk from 'chalk';

/*

Intro:

    As we introduced "type" to both User and Admin
    it's now easier to distinguish between them.
    Once object type checking logic was extracted
    into separate functions isUser and isAdmin -
    logPerson function got new type errors.

Exercise:

    Figure out how to help TypeScript understand types in
    this situation and apply necessary fixes.

Run:

    npm run 3

    - OR -

    yarn -s 3

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

type Person = User | Admin;

const persons: Person[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' }
];

function isAdmin(person: Person): person is Admin {
    return person.type === 'admin';
}

function isUser(person: Person): person is User {
    return person.type === 'user';
}

function logPerson(person: Person) {
    let additionalInformation: string = '';
    if (isAdmin(person)) {
        additionalInformation = person.role;
    }
    if (isUser(person)) {
        additionalInformation = person.occupation;
    }
    console.log(` - ${chalk.green(person.name)}, ${person.age}, ${additionalInformation}`);
}

console.log(chalk.yellow('Admins:'));
persons.filter(isAdmin).forEach(logPerson);

console.log();

console.log(chalk.yellow('Users:'));
persons.filter(isUser).forEach(logPerson);

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates
