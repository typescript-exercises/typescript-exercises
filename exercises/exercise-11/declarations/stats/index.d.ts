declare module 'stats' {
    type ComparatorFn<T> = (a: T, b: T) => number 

    type StatIndexFn = <T>(input: T[], comparator: ComparatorFn<T>) => number
    type StatElementFn = <T>(input: T[], comparator: ComparatorFn<T>) => T | null

    export const getMaxIndex: StatIndexFn
    export const getMaxElement: StatElementFn;
    export const getMinIndex: StatIndexFn
    export const getMinElement: StatElementFn
    export const getMedianIndex: StatIndexFn
    export const getMedianElement: StatElementFn
    export function getAverageValue<T>(input: T[], getValue: (item: T) => number): number | null;
}
