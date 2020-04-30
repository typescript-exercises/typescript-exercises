declare module 'stats' {
    type Comparator<I> = (a: I, b: I) => number;
    type StatIndexFunction = <I>(input: I[], comparator: Comparator<I>) => number;
    type StatElementFunction = <I>(input: I[], comparator: Comparator<I>) => I;

    export const getMaxIndex: StatIndexFunction;
    export const getMinIndex: StatIndexFunction;
    export const getMedianIndex: StatIndexFunction;
    export const getMaxElement: StatElementFunction;
    export const getMinElement: StatElementFunction;
    export const getMedianElement: StatElementFunction;
    export const getAverageValue: <I, O>(items: I[], getValue: (item: I) => O) => O;
}
