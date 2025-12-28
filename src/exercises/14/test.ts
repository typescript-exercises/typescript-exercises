import {IsTypeEqual, typeAssert} from 'type-assertions';
import {
    ApiRoute,
    ApiRouteWithId,
    HttpMethod,
    ApiEndpoint,
    EntityEvent,
    AllEndpointsFor,
    EntityType,
    ActionType
} from './index';

// Test ApiRoute
typeAssert<
    IsTypeEqual<
        ApiRoute<'users'>,
        '/api/users'
    >
>();

typeAssert<
    IsTypeEqual<
        ApiRoute<'admins'>,
        '/api/admins'
    >
>();

// Test ApiRouteWithId
typeAssert<
    IsTypeEqual<
        ApiRouteWithId<'users'>,
        '/api/users/:id'
    >
>();

typeAssert<
    IsTypeEqual<
        ApiRouteWithId<'admins'>,
        '/api/admins/:id'
    >
>();

// Test HttpMethod
typeAssert<
    IsTypeEqual<
        HttpMethod,
        'GET' | 'POST' | 'PUT' | 'DELETE'
    >
>();

// Test ApiEndpoint
typeAssert<
    IsTypeEqual<
        ApiEndpoint<'GET', 'users'>,
        'GET /api/users'
    >
>();

typeAssert<
    IsTypeEqual<
        ApiEndpoint<'POST', 'admins'>,
        'POST /api/admins'
    >
>();

typeAssert<
    IsTypeEqual<
        ApiEndpoint<'DELETE', 'users'>,
        'DELETE /api/users'
    >
>();

// Test EntityEvent
typeAssert<
    IsTypeEqual<
        EntityEvent<'users', 'created'>,
        'users:created'
    >
>();

typeAssert<
    IsTypeEqual<
        EntityEvent<'admins', 'updated'>,
        'admins:updated'
    >
>();

typeAssert<
    IsTypeEqual<
        EntityEvent<'users', 'deleted'>,
        'users:deleted'
    >
>();

// Test AllEndpointsFor
typeAssert<
    IsTypeEqual<
        AllEndpointsFor<'users'>,
        'GET /api/users' | 'POST /api/users' | 'PUT /api/users' | 'DELETE /api/users'
    >
>();

typeAssert<
    IsTypeEqual<
        AllEndpointsFor<'admins'>,
        'GET /api/admins' | 'POST /api/admins' | 'PUT /api/admins' | 'DELETE /api/admins'
    >
>();

// Test combined types
typeAssert<
    IsTypeEqual<
        ApiEndpoint<HttpMethod, EntityType>,
        'GET /api/users' | 'GET /api/admins' |
        'POST /api/users' | 'POST /api/admins' |
        'PUT /api/users' | 'PUT /api/admins' |
        'DELETE /api/users' | 'DELETE /api/admins'
    >
>();

typeAssert<
    IsTypeEqual<
        EntityEvent<EntityType, ActionType>,
        'users:created' | 'users:updated' | 'users:deleted' |
        'admins:created' | 'admins:updated' | 'admins:deleted'
    >
>();
