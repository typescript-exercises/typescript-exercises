declare module 'stats' {
    type ComparatorFn<T, R> = (input: T[], comparator: (a: T, b: T) => number) => R;

    type CompArgs<T> = [T[], (a: T, b: T) => number];

    function GetIndexFn<T>(input: T[], comparator: (a: T, b: T) => number): number;
    function GetElementFn<T>(input: T[], comparator: (a: T, b: T) => number): T | null;

    export const getMaxIndex: typeof GetIndexFn;
    export const getMinIndex: typeof GetIndexFn;
    export const getMedianIndex: typeof GetIndexFn;
    export const getMaxElement: typeof GetElementFn;
    export const getMinElement: typeof GetElementFn;
    export const getMedianElement: typeof GetElementFn;
    export const getAverageValue: typeof GetElementFn;
}
