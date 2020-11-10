declare module 'str-utils' {
    type Util = (value: string) => string;
    export function strReverse: Util;
    export function strToLower: Util;
    export function strToUpper: Util;
    export function strRandomize: Util;
    export function strInvertCase: Util;
}
