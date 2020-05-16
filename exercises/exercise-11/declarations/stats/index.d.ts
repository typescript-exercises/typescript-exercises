declare module 'stats' {
    export function getMaxIndex<T>(input: Array<T>, comparator: (a: T, b: T) => number): number;
    export function getMaxElement<T>(input: Array<T>, comparator: (a: T, b: T) => number): T | null;
    export function getMinIndex<T>(input: Array<T>, comparator: (a: T, b: T) => number): number;
    export function getMinElement<T>(input: Array<T>, comparator: (a: T, b: T) => number): T | null;
    export function getAverageValue<T>(input: Array<T>, comparator: (a: T, b: T) => number): number | null;
    export function getMedianIndex<T>(input: Array<T>, comparator: (a: T, b: T) => number): number;
    export function getMedianElement<T>(input: Array<T>, comparator: (a: T, b: T) => number): T | null;
}
