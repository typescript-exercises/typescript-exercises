/*

Intro:

    All 2 users liked the idea of the community. We should go
    forward and introduce some order. We are in Germany after all.
    Let's add a couple of admins.

    Initially we only had users in the in-memory database. After
    introducing Admins, we need to fix the types so that
    everything works well together.

Exercise:

    Type "Person" is missing, please define it and use
    it in persons array and logPerson function in order to fix
    all the TS errors.

*/

interface User {
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    name: string;
    age: number;
    role: string;
}

<<<<<<< HEAD:exercises/exercise-01/index.ts
type Person = User | Admin;

const persons: Person[] /* <- Person[] */ = [
=======
export type Person = unknown;

export const persons: User[] /* <- Person[] */ = [
>>>>>>> upstream/master:src/exercises/2/index.ts
    {
        name: 'Max Mustermann',
        age: 25,
        occupation: 'Chimney sweep'
    },
    {
        name: 'Jane Doe',
        age: 32,
        role: 'Administrator'
    },
    {
        name: 'Kate Müller',
        age: 23,
        occupation: 'Astronaut'
    },
    {
        name: 'Bruce Willis',
        age: 64,
        role: 'World saver'
    }
];

<<<<<<< HEAD:exercises/exercise-01/index.ts
function logPerson(user: Person) {
    console.log(` - ${chalk.green(user.name)}, ${user.age}`);
=======
export function logPerson(user: User) {
    console.log(` - ${user.name}, ${user.age}`);
>>>>>>> upstream/master:src/exercises/2/index.ts
}

persons.forEach(logPerson);

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
