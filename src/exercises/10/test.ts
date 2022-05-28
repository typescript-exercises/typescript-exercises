import {IsTypeEqual, IsTypeAssignable, FirstArgument, typeAssert} from 'type-assertions';
import {api, promisify, ApiResponse} from './index';

typeAssert<
    IsTypeAssignable<
        FirstArgument<typeof promisify>,
        (callback: (response: ApiResponse<number>) => void) => void
    >
>();
typeAssert<
    IsTypeAssignable<
        FirstArgument<typeof promisify>,
        (callback: (response: ApiResponse<string>) => void) => void
    >
>();
typeAssert<
    IsTypeAssignable<
        ReturnType<typeof promisify>,
        () => Promise<number>
    >
>();
typeAssert<
    IsTypeAssignable<
        ReturnType<typeof promisify>,
        () => Promise<boolean>
    >
>();

typeAssert<
    IsTypeEqual<
        typeof api.requestAdmins,
        () => Promise<
            {
                type: 'admin';
                name: string;
                age: number;
                role: string;
            }[]
        >
    >
>();

typeAssert<
    IsTypeEqual<
        typeof api.requestUsers,
        () => Promise<
            {
                type: 'user';
                name: string;
                age: number;
                occupation: string;
            }[]
        >
    >
>();

typeAssert<
    IsTypeEqual<
        typeof api.requestCurrentServerTime,
        () => Promise<number>
    >
>();

typeAssert<
    IsTypeEqual<
        typeof api.requestCoffeeMachineQueueLength,
        () => Promise<number>
    >
>();

