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
