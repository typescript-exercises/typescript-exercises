/*

Intro:

    Remember how we introduced that API and then
    promisified everything? Well, our backend team
    has been having... issues. We've gone from callback
    hell to Promise hell. Progress!

    The real problem: Our developers keep writing
    `api/user` instead of `api/users`, `POST /api/admins`
    instead of `POST /api/admin`, and last Tuesday someone
    deployed `/api/porpoises` endpoint (we don't have
    porpoises in our system). These bugs only surface in
    production because we're "agile" which, according to
    management, means "QA is optional."

    We also have an event system where developers hand-type
    strings like 'user:created'. This has led to 'user:crated',
    'usr:created', one memorable 'user:createdddddd', and
    my personal favorite: 'usr:craetd'. The CTO's solution?
    "Hire people who can type." Thanks, boss.

    Our architect suggested using TypeScript's template
    literal types to prevent this madness. When asked what
    those are, he said "magic" and went to lunch.

Exercise:

    We need type-safe string patterns for our API routes and events.
    Instead of accepting any string (which allows typos), create
    types that construct and validate these strings at compile time.

    Define types that generate these string patterns:

    1. ApiRoute<T> - constructs API routes like '/api/users' or
       '/api/admins' from an entity type

    2. ApiRouteWithId<T> - constructs routes with ID parameters
       like '/api/users/:id'

    3. HttpMethod - represents valid HTTP methods
       (GET, POST, PUT, DELETE)

    4. ApiEndpoint<M, T> - combines method and route into strings
       like 'GET /api/users' or 'POST /api/admins'

    5. EntityEvent<Entity, Action> - constructs event names like
       'users:created', 'admins:updated', 'users:deleted'

    6. AllEndpointsFor<T> - generates a union of ALL possible
       HTTP method + route combinations for a given entity
       (e.g., 'GET /api/users' | 'POST /api/users' | 'PUT /api/users' | 'DELETE /api/users')

Higher difficulty bonus exercise:

    Create a type UppercaseEvent<T> that takes an EntityEvent
    and converts it to uppercase (e.g., 'users:created' -> 'USERS:CREATED')

*/

interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
}

export type Person = User | Admin;
export type EntityType = 'users' | 'admins';
export type ActionType = 'created' | 'updated' | 'deleted';

// Define these template literal types:

export type ApiRoute<T extends string> = `/api/${T}`;

export type ApiRouteWithId<T extends string> = `/api/${T}/:id`;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ApiEndpoint<M extends string, T extends string> = `${M} /api/${T}`;

export type EntityEvent<Entity extends string, Action extends string> = `${Entity}:${Action}`;

export type AllEndpointsFor<T extends string> = ApiEndpoint<HttpMethod, T>;

// Bonus:
export type UppercaseEvent<T extends string> = Uppercase<T>;

// Usage examples:

export function callApi<M extends HttpMethod, E extends EntityType>(
    method: M,
    entity: E,
    endpoint: ApiEndpoint<M, E>
) {
    console.log(`Calling ${endpoint}`);
}

export function emitEvent<E extends EntityType, A extends ActionType>(
    event: EntityEvent<E, A>
) {
    console.log(`Emitting event: ${event}`);
}

export function getRoute<E extends EntityType>(entity: E): ApiRoute<E> {
    return `/api/${entity}` as ApiRoute<E>;
}

export function getRouteWithId<E extends EntityType>(entity: E, id: string): ApiRouteWithId<E> {
    return `/api/${entity}/${id}` as ApiRouteWithId<E>;
}

// These should be type-safe:
callApi('GET', 'users', 'GET /api/users');
callApi('POST', 'admins', 'POST /api/admins');
emitEvent('users:created');
emitEvent('admins:updated');

console.log(getRoute('users')); // '/api/users'
console.log(getRouteWithId('admins', '123')); // '/api/admins/123'

// Test AllEndpointsFor - should accept any valid method+route combination
export function handleRequest(endpoint: AllEndpointsFor<'users'>) {
    console.log(`Handling: ${endpoint}`);
}

handleRequest('GET /api/users');
handleRequest('POST /api/users');
handleRequest('PUT /api/users');
handleRequest('DELETE /api/users');

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
