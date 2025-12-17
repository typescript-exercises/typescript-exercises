import {IsTypeEqual, typeAssert} from 'type-assertions';
import {
    AppConfig,
    DeepReadonly,
    createUser,
    updateUser,
    PERMISSIONS_TEMPLATE,
    STATUS_CODES
} from './index';

// Test DeepReadonly
type TestObject = {
    a: string;
    b: {
        c: number;
        d: {
            e: boolean;
        };
    };
};

type ReadonlyTestObject = DeepReadonly<TestObject>;

// Test that top level is readonly
typeAssert<
    IsTypeEqual<
        ReadonlyTestObject['a'],
        string
    >
>();

// Test that nested objects are readonly
typeAssert<
    IsTypeEqual<
        ReadonlyTestObject['b']['c'],
        number
    >
>();

// Test AppConfig is deeply readonly
typeAssert<
    IsTypeEqual<
        AppConfig['apiUrl'],
        string
    >
>();

// Test STATUS_CODES preserves literals and is readonly
typeAssert<
    IsTypeEqual<
        typeof STATUS_CODES.success,
        'SUCCESS'
    >
>();

typeAssert<
    IsTypeEqual<
        typeof STATUS_CODES.notFound,
        'NOT_FOUND'
    >
>();

// Test PERMISSIONS_TEMPLATE is readonly
typeAssert<
    IsTypeEqual<
        typeof PERMISSIONS_TEMPLATE.read,
        readonly ['posts', 'comments']
    >
>();

typeAssert<
    IsTypeEqual<
        typeof PERMISSIONS_TEMPLATE.write,
        readonly ['posts']
    >
>();

// Test createUser returns readonly
typeAssert<
    IsTypeEqual<
        ReturnType<typeof createUser>,
        Readonly<{
            type: 'user';
            name: string;
            age: number;
            occupation: string;
            metadata: {
                lastLogin: Date;
                loginCount: number;
            };
        }>
    >
>();

// Test updateUser signature
typeAssert<
    IsTypeEqual<
        ReturnType<typeof updateUser>,
        Readonly<{
            type: 'user';
            name: string;
            age: number;
            occupation: string;
            metadata: {
                lastLogin: Date;
                loginCount: number;
            };
        }>
    >
>();
