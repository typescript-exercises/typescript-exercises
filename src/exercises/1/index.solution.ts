/*

Welcome to:

    ................................................................
    .                                                              .
    .     ####################    ####################      E      .
    .     ####################    ####################      X      .
    .             ####            ####                      E      .
    .             ####            ####                      R      .
    .             ####            ####################      C      .
    .             ####                            ####      I      .
    .             ####                            ####      S      .
    .             ####            ####################      E      .
    .             ####            ####################      S      .
    .                                                              .
    ................................................................

    The goal: Let everyone play with many different TypeScript features
    and get an overview of TypeScript capabilities and principles.

    Things to cover:

        1. Basic typing.
        2. Refining types.
        3. Union types.
        4. Merged types.
        5. Generics.
        6. Type declarations.
        7. Module augmentation.
        8. Advanced type mapping.

    Rules and principles:

        1. Avoid using "any" type at all costs.
        2. Difficulty quickly grows one exercise after another.
        3. Feel free to send pull requests if you've come up
           with improvements!
        4. Provide feedback to the creator of these exercises.
        5. Enjoy.

Brief UI guide:

    +--------------------------------------------------------------+
    | TypeScript exercises                                         |
    +--------------------------------------------------------------+
    | Exercises 1·2·3·4...   << Navigate through exercises >>      |
    +---------------+----------------------------------------------+
    | Files         | file.ts   << Filename and status >>          |
    +---------------+----------------------------------------------+
    | file.ts       | 1  import {x} from 'y';                      |
    | dir           | 2                                            |
    |   sub.ts      | 3                                            |
    |               |                                              |
    | << Current    |   << Currently selected file code editor >>  |
    | exercise file |                                              |
    | structure >>  +----------------------------------------------+
    |               |                                              |
    |               |   << Errors to fix in order to proceed >>    |
    |               |                                              |
    +---------------+----------------------------------------------+

Intro:

    We are starting a small community of users. For performance
    reasons, we have decided to store all users right in the code.
    This way we can provide our developers with more
    user-interaction opportunities. With user-related data, at least.
    All the GDPR-related issues will be solved some other day.
    This would be the basis for our future experiments during
    these exercises.

Exercise:

    Given the data, define the interface "User" and use it accordingly.

*/

export interface User {
    name: string;
    age: number;
    occupation: string;
}

export const users: User[] = [
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

export function logPerson(user: User) {
    console.log(` - ${user.name}, ${user.age}`);
}

console.log('Users:');
users.forEach(logPerson);


// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/objects.html
