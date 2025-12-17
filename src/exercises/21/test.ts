import {typeAssert, IsTypeEqual} from 'type-assertions';
import {ObjectManipulator} from './index';

const test1 = new ObjectManipulator({})
    .set('x', 123)
    .set('y', 'hello')
    .getObject();

typeAssert<IsTypeEqual<typeof test1, {x: number; y: string}>>();

const test2 = new ObjectManipulator({})
    .set('x', 123)
    .set('y', 'hello')
    .set('z', true)
    .delete('z')
    .delete('y')
    .getObject();

typeAssert<IsTypeEqual<typeof test2, {x: number}>>();

const test3 = new ObjectManipulator({})
    .set('x', 123)
    .set('y', 'hello')
    .delete('y')
    .get('x');

typeAssert<IsTypeEqual<typeof test3, number>>();

const test4 = new ObjectManipulator({x: true, y: 'hello'})
    .delete('y')
    .get('x');

typeAssert<IsTypeEqual<typeof test4, boolean>>();

