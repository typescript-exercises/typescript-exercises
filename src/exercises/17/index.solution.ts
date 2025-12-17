/*

Intro:

    Remember PowerUsers? Remember how they started bullying
    everyone and we had to remove them? Well, our CEO never
    forgave us for "giving up" on that feature. So now we're
    adding "Moderators" – which is just PowerUsers with a
    different name. When we pointed this out, the CEO said
    "this time it's different" and refused to elaborate.

    We added the Moderator type to our database (which is
    still just a TypeScript file because "migration costs").
    We updated some of the code. We THINK we updated all
    of the code. We're pretty sure. Actually, we're not sure.

    Yesterday, a moderator tried to view their profile and
    got a white screen of death. The error message just said
    "undefined is not a function" which is TypeScript's way
    of saying "you forgot something, buddy."

    Turns out we have 47 switch statements checking user
    types, and we updated only 43 of them. The CTO asked
    why TypeScript didn't catch this. We explained that
    TypeScript can only help if we TELL it to check. He
    suggested we "make the types smarter." Thanks, boss.

Exercise:

    We have functions with switch statements that don't handle
    all cases. Right now, TypeScript doesn't warn us when we
    forget to handle a case - the code just silently returns
    an empty string or undefined.

    Make TypeScript catch these mistakes at compile time:

    1. Fix getUserLabel() so it fails to compile if any Person
       type is not handled

    2. Fix handlePersonAction() with the same protection

    3. Fix processStatus() to handle all Status cases with
       compile-time verification

    Hint: The assertNever() helper function is already defined
    for you to use in the default case.

Higher difficulty bonus exercise:

    Implement assertUnreachable() - an improved version that
    logs the unexpected value before throwing an error.

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

interface Moderator {
    type: 'moderator';
    name: string;
    age: number;
    department: string;
}

export type Person = User | Admin | Moderator;

export type Status = 'active' | 'inactive' | 'pending' | 'banned';

export const persons: Person[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'moderator', name: 'John Smith', age: 28, department: 'Content' }
];

// Helper function for exhaustiveness checking
export function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

// Bonus: Create a better version that logs before throwing
export function assertUnreachable<T>(value: T & never): never {
    console.error('Unreachable code reached with value:', value);
    throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// Fix this function - it should not compile if a Person type is not handled
export function getUserLabel(person: Person): string {
    switch (person.type) {
        case 'user':
            return `User: ${person.name} - ${person.occupation}`;
        case 'admin':
            return `Admin: ${person.name} - ${person.role}`;
        case 'moderator':
            return `Moderator: ${person.name} - ${person.department}`;
        default:
            return assertNever(person);
    }
}

// Fix this function - add exhaustiveness checking
export function handlePersonAction(person: Person, action: 'promote' | 'demote'): string {
    switch (person.type) {
        case 'user':
            return `${action} user ${person.name}`;
        case 'admin':
            return `${action} admin ${person.name}`;
        case 'moderator':
            return `${action} moderator ${person.name}`;
        default:
            return assertNever(person);
    }
}

// Fix this function to handle all status cases
export function processStatus(status: Status): string {
    switch (status) {
        case 'active':
            return 'User is active';
        case 'inactive':
            return 'User is inactive';
        case 'pending':
            return 'User is pending approval';
        case 'banned':
            return 'User is banned';
        default:
            return assertNever(status);
    }
}

// Test the functions
console.log(getUserLabel(persons[0]));
console.log(getUserLabel(persons[1]));
console.log(getUserLabel(persons[2])); // This should work once fixed

console.log(handlePersonAction(persons[0], 'promote'));
console.log(processStatus('active'));

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type
