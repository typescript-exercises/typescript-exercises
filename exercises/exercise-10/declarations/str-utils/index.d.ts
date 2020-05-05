declare module 'str-utils' {
  // export const ...
  // export function ...
  type arg = string;
  type res = string;
  export function strReverse(arg: arg): res;
  export function strToLower(arg: arg): res;
  export function strToUpper(arg: arg): res;
  export function strRandomize(arg: arg): res;
  export function strInvertCase(arg: arg): res;
}
