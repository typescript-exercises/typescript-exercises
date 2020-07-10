import * as dateWizard from 'date-wizard';
import './module-augmentations/date-wizard';

/*

Intro:

    The next logical step for us is to provide more
    precise registration date for our users and admins.
    We've approximately made up dates for each user and
    admin and used a library called "date-wizard" in
    order to pretty-format the dates.

    Unfortunately, type declarations which came with
    "date-wizard" library were incomplete.

    1. DateDetails interface is missing
       time related fields such as hours, minutes and
       seconds.
    2. Function "pad" is exported but not declared.

Exercise:

    Check date-wizard module implementation at:
    node_modules/date-wizard/index.js
    node_modules/date-wizard/index.d.ts

    Extend type declaration of that module in:
    module-augmentations/date-wizard/index.ts

*/

interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
    registered: Date;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
    registered: Date;
}

type Person = User | Admin;

const admins: Admin[] = [
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator', registered: new Date('2016-06-01T16:23:13') },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver', registered: new Date('2017-02-11T12:12:11') },
    { type: 'admin', name: 'Steve', age: 40, role: 'Steve', registered: new Date('2018-01-05T11:02:30') },
    { type: 'admin', name: 'Will Bruces', age: 30, role: 'Overseer', registered: new Date('2018-08-12T10:01:24') },
    { type: 'admin', name: 'Superwoman', age: 28, role: 'Customer support', registered: new Date('2019-03-25T07:51:05') }
];

const users: User[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep', registered: new Date('2016-02-15T09:25:13') },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut', registered: new Date('2016-03-23T12:47:03') },
    { type: 'user', name: 'Moses', age: 70, occupation: 'Desert guide', registered: new Date('2017-02-19T17:22:56') },
    { type: 'user', name: 'Superman', age: 28, occupation: 'Ordinary person', registered: new Date('2018-02-25T19:44:28') },
    { type: 'user', name: 'Inspector Gadget', age: 31, occupation: 'Undercover', registered: new Date('2019-03-25T09:29:12') }
];

const isAdmin = (person: Person): person is Admin => person.type === 'admin';
const isUser = (person: Person): person is User => person.type === 'user';

function logPerson(person: Person, index: number) {
    let additionalInformation: string = '';
    if (isAdmin(person)) {
        additionalInformation = person.role;
    }
    if (isUser(person)) {
        additionalInformation = person.occupation;
    }
    let registeredAt = dateWizard(person.registered, '{date}.{month}.{year} {hours}:{minutes}');
    let num = `#${dateWizard.pad(index + 1)}`;
    console.log(
        ` - ${num}: ${person.name}, ${person.age}, ${additionalInformation}, ${registeredAt}`
    );
}

export {
    dateWizard
};

console.log('All users:');

([] as Person[])
    .concat(users, admins)
    .forEach(logPerson);

console.log();

console.log('Early birds:');

([] as Person[])
    .concat(users, admins)
    .filter((person) => dateWizard.dateDetails(person.registered).hours < 10)
    .forEach(logPerson);

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
