# Notes

## Exercise 0

Exercise 0 is extremely easy, but maybe good as a way to get everything set up?

The annotation on `users` is optional.

## Exercise 1

Introduces union types.

## Exercise 2

Not clear what he's trying to introduce here:
`in` for refinement, user-defined type guards, tagged unions?

(From the hint it seems to be `in`.)

The annotation on `additionalInformation` in `logPerson` is not required.

## Exercise 3

Introduces user-defined type guards, I think? But at the same time as a tag.
Maybe building up to tagged unions?

```ts
let additionalInformation: string = '';
```

Is kinda ugly.

## Exercise 4

Says it introduces mapped types (in the hint) but these are not necessary.
You can solve the problem using `Partial` and the bonus using `Omit`.
It took me a minute to figure out what the bonus was asking, but I like it.
The `as (keyof Criteria)` in `filterUsers` is ugly but I think unavoidable.

## Exercise 5

I started using conditional types but then looked at the hint link and realized
he wanted me to use an overload. Redoing this with conditional types would be a
good extension.

I'm curious why he doesn't make more thorough use of `return`-less arrow functions.

Bonus exercise: author does not understand why `Object.keys` returns `string[]`.
I think this is also somewhat misguided since it just hides a type assertion.

"cast it" → "use a type assertion"

This would be a good opportunity to use `@ts-expect-error`:

```ts
// @ts-expect-error
let astronautAdmins: Admin[] = filterPersons(persons, 'admin', { occupation: 'Astronaut' });
```

This shows the problem with overloading:

```ts
let peopleOfAge23: Person[] = filterPersons(
  persons, Math.random() < 0.5 ? 'user' : 'admin', {age: 23}
);
```

## Exercise 6

I really enjoy the tone ("CEO's friend Nick").

This introduces tuple types and generics (those weren't introduced earlier?).

This one is quite easy compared to Exercise 5.

## Exercise 7

Introduces intersection types. Not really clear to me what the goal of this one is
if you don't do the bonus exercise (intersecting tagged union types w/ omit).

→ when are we going to get to tagged unions? Why all the user-defined type guards?

## Exercise 8

Continues introducing generic types using success/error API responses.

→ I don't like the extensive use of callbacks here.

## Exercise 9

Introduces Promises. Not really clear to me what you're supposed to do in this exercise
if you don't want to do the bonus problem?

I think this is a great problem (implement `promisify`).
Instructions could be more clear that you're expected to wrap errors in an `Error` object.

## Exercise 10

Introduces `.d.ts` files.

Took me a minute to realize he meant:

    exercises/exercise-10/node_modules/str-utils

and not

    node_modules/str-utils

This might be a useful trick for literate-ts!

Not totally clear to me why he had both `export const` and `export function` in the
stub `index.d.ts` file. The `const` approach is a good option if you want to use a type
alias instead of repeating function signatures.

## Exercise 11

Adding this to my `.vscode/settings.json` makes it possible to open files in node_modules:

```json
{
  "files.exclude": {
    "**/node_modules": false,
  }
}
```

It would be nice if he made something fail if you forgot to include `| null` in the get*Element
declarations.

I did the bonus via this:

```ts
type CompArgs<T> = [T[], (a: T, b: T) => number];

export function getMaxIndex<T>(...args: CompArgs<T>): number;
```

But I don't like that you lose the paramter names this way. I don't think it's possible
to write a more generic type, though, at least not any way I can see:

```ts
type ComparatorFn<T, R> = (input: T[], comparator: (a: T, b: T) => number) => R;

export const getMaxIndex = ...?
```

Since there are only two possible return types, this is also a solution:

```ts
function GetIndexFn<T>(input: T[], comparator: (a: T, b: T) => number): number;
function GetElementFn<T>(input: T[], comparator: (a: T, b: T) => number): T | null;

export const getMaxIndex: typeof GetIndexFn;
export const getMinIndex: typeof GetIndexFn;
export const getMedianIndex: typeof GetIndexFn;
export const getMaxElement: typeof GetElementFn;
export const getMinElement: typeof GetElementFn;
export const getMedianElement: typeof GetElementFn;
export const getAverageValue: typeof GetElementFn;
```

I believe you have to define `GetIndexFn` as a function (not a type) and use `typeof` to make this work.

## Exercise 12

Covers module augmentation. I really like having an explicit problem showing this.

I'm not sure I agree with the terminology / method here:

```ts
// This enabled module augmentation mode.
import 'date-wizard';
```

This one gave me some trouble; I wanted to put a `declare namespace` or `namespace` somewhere but it turns out not to be necessary and I'm not 100% sure why.

meta: I wish the files weren't all called `index.*`.

## Exercise 13

`class Database<T>` --> possibly a good time to introduce parameter properties.

