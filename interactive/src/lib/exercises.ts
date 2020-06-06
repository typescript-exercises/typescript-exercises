/* eslint import/no-webpack-loader-syntax: off */

import {FileTree} from './file-tree';

type Exercise = {
    files: FileTree,
    info: {
        hints: string[]
    }
}

const typeAssertions: FileTree = {
    'node_modules/type-assertions/index.ts': {
        content: require('!!raw-loader!../exercises/general/node_modules/type-assertions/index.ts').default,
        readOnly: true
    },
    'node_modules/type-assertions/package.json': {
        content: JSON.stringify(
            require('../exercises/general/node_modules/type-assertions/package.json'),
            null,
            2
        ),
        readOnly: true
    }
};

export const exercises: Exercise[] = [
    {
        files: {
            'index.ts': {
                content: require('!!raw-loader!../exercises/0/index.ts').default
            },
            'test.ts': {
                content: require('!!raw-loader!../exercises/0/test.ts').default,
                readOnly: true
            },
            ...typeAssertions
        },
        info: require('../exercises/0/exercise.json')
    }
];
