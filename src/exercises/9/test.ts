import {IsTypeEqual, typeAssert} from 'type-assertions';
import {
    NotificationContact,
    ResponseData,
    UnwrapPromise,
    IsAdmin,
    sendNotification,
    getResponse
} from './index';

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

// Test NotificationContact
typeAssert<
    IsTypeEqual<
        NotificationContact<User>,
        'email'
    >
>();

typeAssert<
    IsTypeEqual<
        NotificationContact<Admin>,
        'sms'
    >
>();

// Test ResponseData
typeAssert<
    IsTypeEqual<
        ResponseData<string>,
        string
    >
>();

typeAssert<
    IsTypeEqual<
        ResponseData<null>,
        'No data available'
    >
>();

typeAssert<
    IsTypeEqual<
        ResponseData<undefined>,
        'No data available'
    >
>();

typeAssert<
    IsTypeEqual<
        ResponseData<number>,
        number
    >
>();

// Test UnwrapPromise
typeAssert<
    IsTypeEqual<
        UnwrapPromise<Promise<string>>,
        string
    >
>();

typeAssert<
    IsTypeEqual<
        UnwrapPromise<Promise<number>>,
        number
    >
>();

typeAssert<
    IsTypeEqual<
        UnwrapPromise<string>,
        string
    >
>();

typeAssert<
    IsTypeEqual<
        UnwrapPromise<boolean>,
        boolean
    >
>();

// Test IsAdmin
typeAssert<
    IsTypeEqual<
        IsAdmin<Admin>,
        true
    >
>();

typeAssert<
    IsTypeEqual<
        IsAdmin<User>,
        false
    >
>();
