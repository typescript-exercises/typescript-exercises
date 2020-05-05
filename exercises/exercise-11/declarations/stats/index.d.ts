declare module 'stats' {
  type input<T> = T[];
  type comparator<T> = (arg1: T, arg2: T) => number;
  export function getMaxIndex<T>(
    input: input<T>,
    comparator: comparator<T>
  ): number;
  export function getMaxElement<T>(
    input: input<T>,
    comparator: comparator<T>
  ): T | null;
  export function getMinIndex<T>(
    input: input<T>,
    comparator: comparator<T>
  ): number;
  export function getMinElement<T>(
    input: input<T>,
    comparator: comparator<T>
  ): T | null;
  export function getMedianIndex<T>(
    input: input<T>,
    comparator: comparator<T>
  ): number;
  export function getMedianElement<T>(
    input: input<T>,
    comparator: comparator<T>
  ): T | null;
  export function getAverageValue<T>(
    input: input<T>,
    getValue: (arg: T) => number
  ): number;
}
