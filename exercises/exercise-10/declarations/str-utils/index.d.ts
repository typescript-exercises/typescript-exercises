type strUtilFunction = (value: string) => string;

declare module 'str-utils' {
    // export const ...

    
    // export function ...

    export var strReverse: strUtilFunction;
    export var strToLower: strUtilFunction;
    export var strToUpper: strUtilFunction;
    export var strRandomize: strUtilFunction;
    export var strInvertCase: strUtilFunction;
}
