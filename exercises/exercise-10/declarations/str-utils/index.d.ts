declare module 'str-utils' {
    type StrUtil = (value: string) => string

    export const strReverse: StrUtil
    export const strToLower: StrUtil
    export const strToUpper: StrUtil
    export const strRandomize: StrUtil
    export const strInvertCase: StrUtil
}
