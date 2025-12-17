/*

Intro:

    We just finished implementing all those filtering
    functions, but now our office manager questions why
    we spent so much time on features that only she
    wanted. She says we need a "proper permissions system"
    instead. We're not sure what that means but it sounds
    important.

    She went to a blockchain conference last week (she
    got lost and attended the wrong conference room,
    but that's beside the point) and came back with
    a revelation: "Use lookup tables!"

    Meanwhile, our "Senior Data Scientist" (he knows
    Excel AND can sum cells) wants to track everything.
    Yesterday he asked if we can track "user vibe."
    We're still not sure what that means, but at least
    we can track numbers.

Exercise:

    Define the following types based on existing types. Don't define
    them from scratch - use TypeScript's built-in capabilities to
    derive them:

    1. PermissionMap - a type that maps permission names (strings)
       to boolean values

    2. UserStatistics - a type that maps statistic names (strings)
       to numbers

    3. BasicPersonInfo - a type that has only 'name' and 'age'
       properties from the Person type

    4. PersonType - a type representing possible values of the
       'type' field from Person (should be 'user' | 'admin')

    5. NonTypePersonKeys - a type representing all Person property
       names except 'type'

Higher difficulty bonus exercise:

    Define AdminOnlyKeys type that represents property names that
    exist in Admin but not in User (should be 'role').

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

export type Person = User | Admin;

export const persons: Person[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' }
];

// Define these types:

export type PermissionMap = unknown;

export type UserStatistics = unknown;

export type BasicPersonInfo = unknown;

export type PersonType = unknown;

export type NonTypePersonKeys = unknown;

// Bonus:
export type AdminOnlyKeys = unknown;

// Usage examples:

export const userPermissions: PermissionMap = {
    canEdit: true,
    canDelete: false,
    canView: true,
    canCreateReports: false
};

export const statistics: UserStatistics = {
    totalLogins: 42,
    averageSessionTime: 1337,
    postsCreated: 15
};

export function getBasicInfo(person: Person): BasicPersonInfo {
    return {
        name: person.name,
        age: person.age
    };
}

export function logPersonType(type: PersonType) {
    console.log(`Person type: ${type}`);
}

console.log('Permissions:', userPermissions);
console.log('Statistics:', statistics);
console.log('Basic info:', getBasicInfo(persons[0]));

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
// https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys
// https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union
// https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers
