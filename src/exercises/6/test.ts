import {IsTypeEqual, typeAssert} from 'type-assertions';
import {
    PermissionMap,
    UserStatistics,
    BasicPersonInfo,
    PersonType,
    NonTypePersonKeys,
    getBasicInfo,
    logPersonType
} from './index';

// Test PermissionMap
typeAssert<
    IsTypeEqual<
        PermissionMap,
        Record<string, boolean>
    >
>();

// Test UserStatistics
typeAssert<
    IsTypeEqual<
        UserStatistics,
        Record<string, number>
    >
>();

// Test BasicPersonInfo
typeAssert<
    IsTypeEqual<
        BasicPersonInfo,
        {name: string; age: number}
    >
>();

// Test PersonType
typeAssert<
    IsTypeEqual<
        PersonType,
        'user' | 'admin'
    >
>();

// Test NonTypePersonKeys
typeAssert<
    IsTypeEqual<
        NonTypePersonKeys,
        'name' | 'age'
    >
>();

// Test function signatures
typeAssert<
    IsTypeEqual<
        ReturnType<typeof getBasicInfo>,
        {name: string; age: number}
    >
>();

typeAssert<
    IsTypeEqual<
        Parameters<typeof logPersonType>[0],
        'user' | 'admin'
    >
>();
