declare module 'stats' {
    type CompareFunction<T> = (value1: T, value2: T) => number;
    type GetIndexValue = <T>(input: T[], comparator: CompareFunction<T>) => number;
    export const getMaxIndex: GetIndexValue;
    export const getMinIndex: GetIndexValue;
    export const getMedianIndex: GetIndexValue;

    type GetElementValue = <T>(input: T[], comparator: CompareFunction<T>) => null | T;
    export const getMaxElement: GetElementValue;
    export const getMinElement: GetElementValue;
    export const getMedianElement: GetElementValue;
    type GetValueFromObject<T> = (item: T) => number;
    type GetValue = <T>(value1: T[], GetValueFromObject: GetValueFromObject<T>) => number | null;

    export const getAverageValue: GetValue;
}
