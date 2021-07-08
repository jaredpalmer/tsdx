"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basicTemplate = {
    name: 'basic',
    dependencies: [
        'husky',
        'tsdx',
        'tslib',
        'typescript',
        'size-limit',
        '@size-limit/preset-small-lib',
    ],
    packageJson: {
        // name: safeName,
        version: '0.1.0',
        license: 'MIT',
        // author: author,
        main: 'dist/index.js',
        // module: `dist/${safeName}.esm.js`,
        typings: `dist/index.d.ts`,
        files: ['dist', 'src'],
        engines: {
            node: '>=10',
        },
        scripts: {
            start: 'tsdx watch',
            build: 'tsdx build',
            test: 'tsdx test',
            lint: 'tsdx lint',
            prepare: 'tsdx build',
            size: 'size-limit',
            analyze: 'size-limit --why',
        },
        peerDependencies: {},
        /*
        'size-limit': [
          {
            path: `dist/${safeName}.cjs.production.min.js`,
            limit: '10 KB',
          },
          {
            path: `dist/${safeName}.esm.js`,
            limit: '10 KB',
          },
        ],
        */
        husky: {
            hooks: {
                'pre-commit': 'tsdx lint',
            },
        },
        prettier: {
            printWidth: 80,
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
        },
    },
};
exports.default = basicTemplate;
