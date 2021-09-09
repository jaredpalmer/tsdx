import { Template } from './template';

const basicTemplate: Template = {
  name: 'basic',
  dependencies: [
    'husky',
    'dts-cli',
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
      start: 'dts watch',
      build: 'dts build',
      test: 'dts test',
      lint: 'dts lint',
      prepare: 'dts build',
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
        'pre-commit': 'dts lint',
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

export default basicTemplate;
