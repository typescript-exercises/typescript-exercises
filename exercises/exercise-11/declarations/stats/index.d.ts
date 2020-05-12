type comparatorFunction<T> = (a: T, b: T) => number;
type getValueFunction<T> = (arg: T) => number;
type getIndexFunction<T> = (input: T[], comparator: comparatorFunction<T>) => number;
type getElementFunction<T> = (input: T[], comparator: comparatorFunction<T>) => T;

declare module 'stats' {
    export function getMaxIndex<T>(input: T[], comparator: comparatorFunction<T>): number;
    export function getMaxElement<T>(input: T[], comparator: comparatorFunction<T>): T;
    export function getMinIndex<T>(input: T[], comparator: comparatorFunction<T>): number;
    export function getMinElement<T>(input: T[], comparator: comparatorFunction<T>): T;
    export function getMedianIndex<T>(input: T[], comparator: comparatorFunction<T>): number;
    export function getMedianElement<T>(input: T[], comparator: comparatorFunction<T>): T;
    export function getAverageValue<T>(input: T[], getValue: getValueFunction<T>): number;
}
