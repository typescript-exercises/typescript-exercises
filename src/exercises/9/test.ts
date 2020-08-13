import {IsTypeEqual, IsTypeAssignable, Not, typeAssert} from 'type-assertions';
import {
    ApiResponse,
    requestAdmins,
    requestUsers,
    requestCoffeeMachineQueueLength,
    requestCurrentServerTime
} from './index';

typeAssert<
    IsTypeAssignable<
        ApiResponse<number>,
        {status: 'success'; data: number}
    >
>();
typeAssert<
    IsTypeAssignable<
        ApiResponse<number>,
        {status: 'error'; error: string}
    >
>();
typeAssert<
    IsTypeAssignable<
        ApiResponse<boolean>,
        {status: 'success'; data: boolean}
    >
>();
typeAssert<
    IsTypeAssignable<
        ApiResponse<boolean>,
        {status: 'error'; error: string}
    >
>();
typeAssert<
    Not<
        IsTypeEqual<
            ApiResponse<number>,
            unknown
        >
    >
>();

typeAssert<
    IsTypeEqual<
        typeof requestAdmins,
        (
            callback: (
                response: {
                    status: 'success';
                    data: {
                            type: 'admin';
                            name: string;
                            age: number;
                            role: string;
                    }[]
                } | {
                    status: 'error';
                    error: string;
                }
            ) => void
        ) => void
    >
>();

typeAssert<
    IsTypeEqual<
        typeof requestUsers,
        (
            callback: (
                response: {
                    status: 'success';
                    data: {
                            type: 'user';
                            name: string;
                            age: number;
                            occupation: string;
                    }[]
                } | {
                    status: 'error';
                    error: string;
                }
            ) => void
        ) => void
    >
>();

typeAssert<
    IsTypeEqual<
        typeof requestCurrentServerTime,
        (
            callback: (
                response: {
                    status: 'success';
                    data: number;
                } | {
                    status: 'error';
                    error: string;
                }
            ) => void
        ) => void
    >
>();

typeAssert<
    IsTypeEqual<
        typeof requestCoffeeMachineQueueLength,
        (
            callback: (
                response: {
                    status: 'success';
                    data: number;
                } | {
                    status: 'error';
                    error: string;
                }
            ) => void
        ) => void
    >
>();
