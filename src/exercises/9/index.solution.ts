/*

Intro:

    PowerUsers idea was bad. Once those users got
    extended permissions, they started bullying others
    and we lost a lot of great users.
    As a response we spent all the remaining money
    on the marketing and got even more users.
    We need to start preparing to move everything to a
    real database. For now we just do some mocks.

    The server API format was decided to be the following:

    In case of success: { status: 'success', data: RESPONSE_DATA }
    In case of error: { status: 'error', error: ERROR_MESSAGE }

    The API engineer started creating types for this API and
    quickly figured out that the amount of types needed to be
    created is too big.

Exercise:

    Remove UsersApiResponse and AdminsApiResponse types
    and use generic type ApiResponse in order to specify API
    response formats for each of the functions.

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

const admins: Admin[] = [
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' }
];

const users: User[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' }
];

export type ApiResponse<T> =
    | { status: 'success'; data: T; }
    | { status: 'error'; error: string; };

export function requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
    callback({
        status: 'success',
        data: admins
    });
}

export function requestUsers(callback: (response: ApiResponse<User[]>) => void) {
    callback({
        status: 'success',
        data: users
    });
}

export function requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
    callback({
        status: 'success',
        data: Date.now()
    });
}

export function requestCoffeeMachineQueueLength(callback: (response: ApiResponse<number>) => void) {
    callback({
        status: 'error',
        error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.'
    });
}

function logPerson(person: Person) {
    console.log(
        ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
    );
}

function startTheApp(callback: (error: Error | null) => void) {
    requestAdmins((adminsResponse) => {
        console.log('Admins:');
        if (adminsResponse.status === 'success') {
            adminsResponse.data.forEach(logPerson);
        } else {
            return callback(new Error(adminsResponse.error));
        }

        console.log();

        requestUsers((usersResponse) => {
            console.log('Users:');
            if (usersResponse.status === 'success') {
                usersResponse.data.forEach(logPerson);
            } else {
                return callback(new Error(usersResponse.error));
            }

            console.log();

            requestCurrentServerTime((serverTimeResponse) => {
                console.log('Server time:');
                if (serverTimeResponse.status === 'success') {
                    console.log(`   ${new Date(serverTimeResponse.data).toLocaleString()}`);
                } else {
                    return callback(new Error(serverTimeResponse.error));
                }

                console.log();

                requestCoffeeMachineQueueLength((coffeeMachineQueueLengthResponse) => {
                    console.log('Coffee machine queue length:');
                    if (coffeeMachineQueueLengthResponse.status === 'success') {
                        console.log(`   ${coffeeMachineQueueLengthResponse.data}`);
                    } else {
                        return callback(new Error(coffeeMachineQueueLengthResponse.error));
                    }

                    callback(null);
                });
            });
        });
    });
}

startTheApp((e: Error | null) => {
    console.log();
    if (e) {
        console.log(`Error: "${e.message}", but it's fine, sometimes errors are inevitable.`)
    } else {
        console.log('Success!');
    }
});

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/generics.html
