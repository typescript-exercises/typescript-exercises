/**
 * Checks if T1 equals to T2.
 */
export type IsTypeEqual<T1, T2> = IsNotAny<T1> extends false ? false : (
    IsNotAny<T2> extends false ? false : (
        [T1] extends [T2] ? ([T2] extends [T1] ? true : false): false
    )
);

/**
 * Checks if T2 can be assigned to T1.
 */
export type IsTypeAssignable<T1, T2> = IsNotAny<T1> extends false ? false : (
    IsNotAny<T2> extends false ? false : (
        [T2] extends [T1] ? true : false
    )
);

/**
 * Returns `false` if `any` or `any[]` is specified, otherwise returns `true`.
 * @see https://stackoverflow.com/a/49928360/3406963
 */

export type IsNotAny<T> = 0 extends (1 & T) ? false : ( 0 extends (1 & ArrayElement<T>) ? false : true);

/**
 * Returns true for false and vice versa.
 */
export type Not<T> = [T] extends [true] ? false : true;

/**
 * Extracts and returns the first argument of the specified function.
 */
export type FirstArgument<T> = T extends (arg1: infer A, ...args: any[]) => any ? A : never;

/**
 * Extracts and returns the second argument of the specified function.
 */
export type SecondArgument<T> = T extends (arg1: any, arg2: infer A, ...args: any[]) => any ? A : never;

/**
 * Extracts and returns the third argument of the specified function.
 */
export type ThirdArgument<T> = T extends (arg1: any, arg2: any, arg3: infer A, ...args: any[]) => any ? A : never;

/**
 * Extracts and returns array element type.
 */
export type ArrayElement<T> = T extends (infer I)[] ? I : never;

/**
 * A simple type assertion function which always expects a true-type.
 */
export function typeAssert<T extends true>() {}
