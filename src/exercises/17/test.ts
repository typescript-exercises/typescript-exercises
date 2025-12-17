import {IsTypeEqual, typeAssert} from 'type-assertions';
import {
    getUserLabel,
    handlePersonAction,
    processStatus,
    assertNever,
    Person,
    Status
} from './index';

// Test that assertNever has correct signature
typeAssert<
    IsTypeEqual<
        Parameters<typeof assertNever>[0],
        never
    >
>();

typeAssert<
    IsTypeEqual<
        ReturnType<typeof assertNever>,
        never
    >
>();

// Test function return types
typeAssert<
    IsTypeEqual<
        ReturnType<typeof getUserLabel>,
        string
    >
>();

typeAssert<
    IsTypeEqual<
        ReturnType<typeof handlePersonAction>,
        string
    >
>();

typeAssert<
    IsTypeEqual<
        ReturnType<typeof processStatus>,
        string
    >
>();

// Test function parameters
typeAssert<
    IsTypeEqual<
        Parameters<typeof getUserLabel>[0],
        Person
    >
>();

typeAssert<
    IsTypeEqual<
        Parameters<typeof handlePersonAction>[0],
        Person
    >
>();

typeAssert<
    IsTypeEqual<
        Parameters<typeof handlePersonAction>[1],
        'promote' | 'demote'
    >
>();

typeAssert<
    IsTypeEqual<
        Parameters<typeof processStatus>[0],
        Status
    >
>();
