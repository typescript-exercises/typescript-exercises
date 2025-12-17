/*

Intro:

    The name-swapping experiment was a huge success!
    It confused everyone so much that they invited
    more friends just to see the chaos. We're growing!
    (For the wrong reasons, but still!)

    Now marketing (which is just Karen, who also handles
    HR and orders coffee) decreed that "push notifications
    are dead" and "email is the new blockchain." This
    conclusion came from a podcast she listened to at
    1.5x speed during her commute.

    The plan: Admins get SMS, users get email. Why?
    Karen tried both and SMS "felt more urgent." When
    we asked for data to support this decision, she said
    "data is a lagging indicator of intuition." We're
    still parsing what that means.

    Our senior dev implemented this with 50+ function
    overloads because he "doesn't trust generics." The
    CTO suggested we "just use any." This is the same
    person who stores passwords in definitely-not-passwords.txt.

Exercise:

    Create types that behave differently based on their input type:

    1. NotificationContact<T> - a type that represents the correct
       notification method: Admins use 'sms', Users use 'email'

    2. ResponseData<T> - a type that handles API responses: if the
       data exists, keep its type; if null/undefined, represent
       'No data available' instead

    3. UnwrapPromise<T> - a type that extracts the value type from
       a Promise, or keeps the type unchanged if it's not a Promise

    4. IsAdmin<T> - a type-level boolean: true for Admin, false for User

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

export const admins: Admin[] = [
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' }
];

export const users: User[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' }
];

// Define these conditional types:

export type NotificationContact<T> = unknown;

export type ResponseData<T> = unknown;

export type UnwrapPromise<T> = unknown;

export type IsAdmin<T> = unknown;

// Usage examples:

export function sendNotification<T extends Person>(
    person: T,
    message: string,
    via: NotificationContact<T>
) {
    console.log(`Sending notification to ${person.name} via ${via}: ${message}`);
}

export function getResponse<T>(data: T): ResponseData<T> {
    if (data === null || data === undefined) {
        return 'No data available' as ResponseData<T>;
    }
    return data as ResponseData<T>;
}

export async function processValue<T>(value: T): Promise<UnwrapPromise<T>> {
    if (value instanceof Promise) {
        return await value as UnwrapPromise<T>;
    }
    return value as UnwrapPromise<T>;
}

// Test the notification system
sendNotification(admins[0], 'Server is down!', 'sms');
sendNotification(users[0], 'Welcome to our platform', 'email');

console.log(getResponse('Hello')); // Should return 'Hello'
console.log(getResponse(null)); // Should return 'No data available'

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
