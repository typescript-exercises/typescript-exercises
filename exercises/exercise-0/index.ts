import chalk from 'chalk';

/*

Intro:

    We are starting a small community of users. For performance
    reasons we decided to store all users right in the code.
    This way we can provide our developers with more
    user-interaction opportunities. At least with user-related data.
    All the GDPR-related issues we will solve some other day.
    This would be the base for our future experiments during
    this workshop.

Exercise:

    Given the data, define an interface "User" and use it accordingly.

Run this exercise:

    yarn -s 0

*/

const users: unknown[] = [
    {
        name: 'Max Mustermann',
        age: 25,
        occupation: 'Chimney sweep'
    },
    {
        name: 'Kate Müller',
        age: 23,
        occupation: 'Astronaut'
    }
];

function logPerson(user: unknown) {
    console.log(` - ${chalk.green(user.name)}, ${user.age}`);
}

console.log(chalk.yellow('Users:'));
users.forEach(logPerson);

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/interfaces.html#introduction
