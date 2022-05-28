/* eslint @typescript-eslint/no-var-requires: off */
/* eslint import/no-webpack-loader-syntax: off */

import {FileTree} from './file-tree';

const typeAssertions: FileTree = {
    '/node_modules/type-assertions/index.ts': {
        content: require('!!raw-loader!../exercises/node_modules/type-assertions/index.ts').default,
        readOnly: true
    }
};

function formatJson<T>(value: T): string {
    return JSON.stringify(value, null, 4);
}

export const exerciseStructures: Record<string, FileTree> = {
    1: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/1/index.ts').default,
            solution: require('!!raw-loader!../exercises/1/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/1/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    2: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/2/index.ts').default,
            solution: require('!!raw-loader!../exercises/2/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/2/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    3: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/3/index.ts').default,
            solution: require('!!raw-loader!../exercises/3/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/3/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    4: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/4/index.ts').default,
            solution: require('!!raw-loader!../exercises/4/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/4/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    5: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/5/index.ts').default,
            solution: require('!!raw-loader!../exercises/5/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/5/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    6: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/6/index.ts').default,
            solution: require('!!raw-loader!../exercises/6/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/6/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    7: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/7/index.ts').default,
            solution: require('!!raw-loader!../exercises/7/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/7/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    8: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/8/index.ts').default,
            solution: require('!!raw-loader!../exercises/8/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/8/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    9: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/9/index.ts').default,
            solution: require('!!raw-loader!../exercises/9/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/9/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    10: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/10/index.ts').default,
            solution: require('!!raw-loader!../exercises/10/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/10/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    11: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/11/index.ts').default,
            readOnly: true
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/11/test.ts').default,
            readOnly: true
        },
        '/declarations/str-utils/index.d.ts': {
            content: require('!!raw-loader!../exercises/11/declarations/str-utils/index.d.ts').default,
            solution: require('!!raw-loader!../exercises/11/declarations/str-utils/index.solution.d.ts').default
        },
        '/node_modules/str-utils/index.js': {
            content: require('!!raw-loader!../exercises/11/node_modules/str-utils/index.js').default,
            readOnly: true
        },
        '/node_modules/str-utils/package.json': {
            content: formatJson(require('../exercises/11/node_modules/str-utils/package.json')),
            readOnly: true
        },
        '/node_modules/str-utils/README.md': {
            content: require('!!raw-loader!../exercises/11/node_modules/str-utils/README.md').default,
            readOnly: true
        },
        ...typeAssertions
    },
    12: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/12/index.ts').default,
            readOnly: true
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/12/test.ts').default,
            readOnly: true
        },
        '/declarations/stats/index.d.ts': {
            content: require('!!raw-loader!../exercises/12/declarations/stats/index.d.ts').default,
            solution: require('!!raw-loader!../exercises/12/declarations/stats/index.solution.d.ts').default
        },
        '/node_modules/stats/index.js': {
            content: require('!!raw-loader!../exercises/12/node_modules/stats/index.js').default,
            readOnly: true
        },
        '/node_modules/stats/package.json': {
            content: formatJson(require('../exercises/12/node_modules/stats/package.json')),
            readOnly: true
        },
        '/node_modules/stats/README.md': {
            content: require('!!raw-loader!../exercises/12/node_modules/stats/README.md').default,
            readOnly: true
        },
        ...typeAssertions
    },
    13: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/13/index.ts').default,
            readOnly: true
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/13/test.ts').default,
            readOnly: true
        },
        '/module-augmentations/date-wizard/index.d.ts': {
            content: require('!!raw-loader!../exercises/13/module-augmentations/date-wizard/index.ts').default,
            solution: require('!!raw-loader!../exercises/13/module-augmentations/date-wizard/index.solution.ts').default
        },
        '/node_modules/date-wizard/index.js': {
            content: require('!!raw-loader!../exercises/13/node_modules/date-wizard/index.js').default,
            readOnly: true
        },
        '/node_modules/date-wizard/index.d.ts': {
            content: require('!!raw-loader!../exercises/13/node_modules/date-wizard/index.d.ts').default,
            readOnly: true
        },
        '/node_modules/date-wizard/package.json': {
            content: formatJson(require('../exercises/13/node_modules/date-wizard/package.json')),
            readOnly: true
        },
        ...typeAssertions
    },
    14: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/14/index.ts').default,
            solution: require('!!raw-loader!../exercises/14/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/14/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    15: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/15/index.ts').default,
            solution: require('!!raw-loader!../exercises/15/index.solution.ts').default
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/15/test.ts').default,
            readOnly: true
        },
        ...typeAssertions
    },
    16: {
        '/index.ts': {
            content: require('!!raw-loader!../exercises/16/index.ts').default,
            readOnly: true
        },
        '/test.ts': {
            content: require('!!raw-loader!../exercises/16/test.ts').default,
            readOnly: true
        }
    }
};
