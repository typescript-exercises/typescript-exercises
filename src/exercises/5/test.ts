import {IsTypeEqual, IsTypeAssignable, Not, FirstArgument, SecondArgument, typeAssert} from 'type-assertions';
import {logPerson, isUser, isAdmin, Person, persons, filterUsers} from './index';

typeAssert<
    IsTypeAssignable<
        SecondArgument<typeof filterUsers>,
        {name: string}
    >
>();
typeAssert<
    IsTypeAssignable<
        SecondArgument<typeof filterUsers>,
        {age: number}
    >
>();
typeAssert<
    IsTypeAssignable<
        SecondArgument<typeof filterUsers>,
        {name: string; age: number}
    >
>();
typeAssert<
    IsTypeAssignable<
        SecondArgument<typeof filterUsers>,
        {occupation: string}
    >
>();
typeAssert<
    IsTypeAssignable<
        SecondArgument<typeof filterUsers>,
        {name: string; age: number; occupation: string}
    >
>();
typeAssert<
    Not<
        IsTypeAssignable<
            SecondArgument<typeof filterUsers>,
            {hello: 'world'}
        >
    >
>();
typeAssert<
    IsTypeEqual<
        ReturnType<typeof filterUsers>,
        {type: 'user'; name: string; age: number; occupation: string}[]
    >
>();

typeAssert<
    IsTypeEqual<
        Person,
        {name: string; age: number} & ({type: 'user'; occupation: string} | {type: 'admin'; role: string})
    >
>();

typeAssert<
    IsTypeEqual<
        typeof persons,
        ({name: string; age: number} & ({type: 'user'; occupation: string} | {type: 'admin'; role: string}))[]
    >
>();

typeAssert<
    IsTypeEqual<
        FirstArgument<typeof logPerson>,
        {name: string; age: number} & ({type: 'user'; occupation: string} | {type: 'admin'; role: string})
    >
>();

typeAssert<
    IsTypeEqual<
        ReturnType<typeof logPerson>,
        void
    >
>();

typeAssert<
    IsTypeEqual<
        FirstArgument<typeof isUser>,
        {name: string; age: number} & ({type: 'user'; occupation: string} | {type: 'admin'; role: string})
    >
>();
typeAssert<
    IsTypeEqual<
        ReturnType<typeof isUser>,
        boolean
    >
>();

typeAssert<
    IsTypeEqual<
        FirstArgument<typeof isAdmin>,
        {name: string; age: number} & ({type: 'user'; occupation: string} | {type: 'admin'; role: string})
    >
>();
typeAssert<
    IsTypeEqual<
        ReturnType<typeof isAdmin>,
        boolean
    >
>();
