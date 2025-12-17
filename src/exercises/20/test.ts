import {typeAssert, IsTypeEqual} from 'type-assertions/index';
import {map, reduce, filter, add, subtract, prop, pipe} from './index';

const mapResult1 = map()(String)()([1, 2, 3]);
typeAssert<IsTypeEqual<typeof mapResult1, string[]>>();

const mapResult2 = map(Boolean, [1, 0, 1]);
typeAssert<IsTypeEqual<typeof mapResult2, boolean[]>>();

const reduceResult1 = reduce()((a: number, b: number) => a + b)()(0)()([1, 2, 3]);
typeAssert<IsTypeEqual<typeof reduceResult1, number>>();

const reduceResult2 = reduce(add, 0, [1, 2, 3]);
typeAssert<IsTypeEqual<typeof reduceResult2, number>>();

const reduceResult3 = reduce(subtract, 0, [1, 2, 3]);
typeAssert<IsTypeEqual<typeof reduceResult3, number>>();

const reduceResult4 = reduce((a: string, b: string) => a + b, '', ['1', '2', '3']);
typeAssert<IsTypeEqual<typeof reduceResult4, string>>();

const filterResult1 = filter()((n: number) => n !== 0)()([0, 1, 2]);
typeAssert<IsTypeEqual<typeof filterResult1, number[]>>();

const filterResult2 = filter(Boolean, [0, 1, 2]);
typeAssert<IsTypeEqual<typeof filterResult2, number[]>>();

const addResult1 = add()(1)()(2);
typeAssert<IsTypeEqual<typeof addResult1, number>>();

const addResult2 = add(1, 2);
typeAssert<IsTypeEqual<typeof addResult2, number>>();

const subtractResult1 = subtract()(2)()(1);
typeAssert<IsTypeEqual<typeof subtractResult1, number>>();

const subtractResult2 = subtract(2, 1);
typeAssert<IsTypeEqual<typeof subtractResult2, number>>();

const propResult1 = prop()('x')()({x: 1, y: 'Hello'});
typeAssert<IsTypeEqual<typeof propResult1, number>>();

const propResult2 = prop('y', {x: 1, y: 'Hello'});
typeAssert<IsTypeEqual<typeof propResult2, string>>();

const pipeResult1 = pipe(filter(Boolean), map(String), reduce((a: string, b: string) => a + b, ''))([0, 1, 2, 3]);
typeAssert<IsTypeEqual<typeof pipeResult1, string>>();

const pipeResult2 = pipe()()(filter(Boolean), map(String))([0, 1, 2, 3]);
typeAssert<IsTypeEqual<typeof pipeResult2, string[]>>();
