declare module 'str-utils' {
    type StrToStr = (value: string) => string;
    export const strReverse: StrToStr;
    export const strToLower: StrToStr;
    export function strToUpper(value: string): string;
    export function strRandomize(value: string): string;
    export function strInvertCase(value: string): string;
}
