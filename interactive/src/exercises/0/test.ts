import {IsTypeEqual, typeAssert} from './node_modules/type-assertions/index';
import {User, logPerson, users} from './index';

typeAssert<IsTypeEqual<User, {name: string, age: number, occupation: string}>>();
typeAssert<IsTypeEqual<typeof users, {name: string, age: number, occupation: string}[]>>();
typeAssert<IsTypeEqual<typeof logPerson, (user: {name: string, age: number, occupation: string}) => void>>();
