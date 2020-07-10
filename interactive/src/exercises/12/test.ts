import {IsTypeEqual, typeAssert} from 'type-assertions';
import {
    getMaxIndex,
    getMaxElement,
    getMinIndex,
    getMinElement,
    getMedianIndex,
    getMedianElement,
    getAverageValue
} from './index';

typeAssert<
    IsTypeEqual<
        typeof getMaxIndex,
        <T>(input: T[], comparator: (a: T, b: T) => number) => number
    >
>();

typeAssert<
    IsTypeEqual<
        typeof getMinIndex,
        <T>(input: T[], comparator: (a: T, b: T) => number) => number
    >
>();

typeAssert<
    IsTypeEqual<
        typeof getMedianIndex,
        <T>(input: T[], comparator: (a: T, b: T) => number) => number
    >
>();

typeAssert<
    IsTypeEqual<
        typeof getMaxElement,
        <T>(input: T[], comparator: (a: T, b: T) => number) => T
    >
>();

typeAssert<
    IsTypeEqual<
        typeof getMinElement,
        <T>(input: T[], comparator: (a: T, b: T) => number) => T
    >
>();

typeAssert<
    IsTypeEqual<
        typeof getMedianElement,
        <T>(input: T[], comparator: (a: T, b: T) => number) => T
    >
>();

typeAssert<
    IsTypeEqual<
        typeof getAverageValue,
        <T>(input: T[], getValue: (item: T) => number) => number
    >
>();
