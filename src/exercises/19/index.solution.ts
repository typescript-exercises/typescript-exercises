/*

Intro:

    Disaster struck at 3 AM last Tuesday. A junior developer
    (who we hired because he said "I'm a quick learner" and
    knew what TypeScript was) decided to "fix" a bug by
    directly modifying our ADMIN_PERMISSIONS constant. In
    production. Without testing.

    He changed a shared configuration object that was supposed
    to be immutable. Every admin suddenly lost all permissions.
    The moderators we just added? Gone. The role configurations
    we spent three exercises setting up? Destroyed.

    When asked why he didn't create a copy, he said "copying
    is inefficient" (he's not wrong, but he's also not right).
    The CTO woke up to 47 Slack messages and one actual phone
    call (remember those?).

    We tried to explain that some things should be readonly.
    The junior dev asked "but what if we need to change them?"
    We said "then they're not constants." He replied "but what
    if we REALLY need to?" This philosophical debate lasted
    20 minutes while production burned.

    The CTO suggested we use AI to "automatically detect which
    variables should be readonly." We're ignoring that and just
    adding type annotations.

Exercise:

    Our config objects and data structures keep getting modified
    accidentally at runtime. We need TypeScript to prevent these
    mutations at compile time.

    The problem: TypeScript's built-in Readonly<T> only makes the
    top-level properties readonly. Nested objects can still be
    mutated. We need deep immutability.

    Fix these issues:

    1. Make AppConfig deeply immutable (all nested properties
       should be readonly)

    2. Implement a DeepReadonly<T> utility type that recursively
       applies readonly to all nested properties

    3. Fix STATUS_CODES so it becomes deeply readonly while
       preserving exact literal types (string literals, not string)

    4. Update createUser() to return an immutable User object

    5. Update updateUser() to work with immutable inputs and
       return an immutable User (remember: updating means creating
       a new object, not modifying the existing one)

    6. Make PERMISSIONS_TEMPLATE deeply immutable

Higher difficulty bonus exercise:

    Create a Mutable<T> utility type that removes readonly
    modifiers (opposite of Readonly<T>), useful when you need
    a mutable working copy of an immutable type.

*/

interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
    metadata: {
        lastLogin: Date;
        loginCount: number;
    };
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
    permissions: string[];
}

export type Person = User | Admin;

// This should be deeply immutable
export type AppConfig = DeepReadonly<{
    apiUrl: string;
    timeout: number;
    features: {
        darkMode: boolean;
        notifications: boolean;
    };
    limits: {
        maxUsers: number;
        maxStorage: number;
    };
}>;

// Create a DeepReadonly type
export type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object
        ? T[K] extends Function
            ? T[K]
            : DeepReadonly<T[K]>
        : T[K];
};

// Should be deeply readonly
export const CONFIG: AppConfig = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    features: {
        darkMode: true,
        notifications: true
    },
    limits: {
        maxUsers: 1000,
        maxStorage: 10000
    }
};

// Should be deeply readonly with exact literal types preserved
export const STATUS_CODES = {
    success: 'SUCCESS',
    notFound: 'NOT_FOUND',
    serverError: 'SERVER_ERROR',
    unauthorized: 'UNAUTHORIZED'
} as const;

// This template should be immutable
export const PERMISSIONS_TEMPLATE = {
    read: ['posts', 'comments'],
    write: ['posts'],
    delete: [] as string[]
} as const;

// Fix these functions to work with readonly types

export function createUser(
    name: string,
    age: number,
    occupation: string
): Readonly<User> {
    return {
        type: 'user',
        name,
        age,
        occupation,
        metadata: {
            lastLogin: new Date(),
            loginCount: 0
        }
    };
}

export function updateUser(
    user: Readonly<User>,
    updates: Partial<Readonly<User>>
): Readonly<User> {
    return {
        ...user,
        ...updates
    };
}

export function clonePermissions(template: typeof PERMISSIONS_TEMPLATE) {
    return {
        read: [...template.read],
        write: [...template.write],
        delete: [...template.delete]
    };
}

// Bonus: Create Mutable type
export type Mutable<T> = {
    -readonly [K in keyof T]: T[K] extends object
        ? Mutable<T[K]>
        : T[K];
};

// Example usage that should work:
const user = createUser('Max', 25, 'Developer');
console.log(user.name);

const updatedUser = updateUser(user, { age: 26 });
console.log(updatedUser.age);

const permissions = clonePermissions(PERMISSIONS_TEMPLATE);
console.log(permissions);

export function getStatusMessage(code: typeof STATUS_CODES[keyof typeof STATUS_CODES]): string {
    return `Status: ${code}`;
}

// These should cause type errors once fixed:
// CONFIG.apiUrl = 'changed'; // Error!
// CONFIG.features.darkMode = false; // Error!
// STATUS_CODES.success = 'CHANGED'; // Error!
// PERMISSIONS_TEMPLATE.read.push('users'); // Error!
// user.name = 'Changed'; // Error!

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype
// https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties
