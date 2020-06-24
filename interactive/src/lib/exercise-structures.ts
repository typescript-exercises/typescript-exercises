/* eslint import/no-webpack-loader-syntax: off */

import {FileTree} from './file-tree';

interface Exercise {
    files: FileTree;
}

const typeAssertions: FileTree = {
    '/node_modules/type-assertions/index.ts': {
        content: require('!!raw-loader!../exercises/node_modules/type-assertions/index.ts').default,
        readOnly: true
    }
};

export const exerciseStructures: Record<string, Exercise> = {
    1: {
        files: {
            '/index.ts': {
                content: require('!!raw-loader!../exercises/1/index.ts').default
            },
            '/test.ts': {
                content: require('!!raw-loader!../exercises/1/test.ts').default,
                readOnly: true
            },
            ...typeAssertions
        }
    },
    2: {
        files: {
            '/index.ts': {
                content: require('!!raw-loader!../exercises/2/index.ts').default
            },
            '/test.ts': {
                content: require('!!raw-loader!../exercises/2/test.ts').default,
                readOnly: true
            },
            ...typeAssertions
        }
    }
};
