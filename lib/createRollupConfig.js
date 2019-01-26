const {
  safeVariableName,
  resolveApp,
  removeScope,
  external,
} = require('./utils');

const { paths, appPackageJson } = require('./constants');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const sourceMaps = require('rollup-plugin-sourcemaps');
const typescript = require('rollup-plugin-typescript2');

const replacements = [{ original: 'lodash', replacement: 'lodash-es' }];

const babelOptions = {
  exclude: /node_modules/,
  plugins: [
    'annotate-pure-calls',
    'dev-expression',
    ['transform-rename-import', { replacements }],
  ],
};

module.exports = function createRollupConfig(format, env, opts) {
  return {
    // Tell Rollup the entry point to the package
    input: resolveApp(opts.input),
    // Tell Rollup which packages to ignore
    external,
    // Establish Rollup output
    output: {
      // Set filenames of the consumer's package
      file: `${paths.appDist}/${safeVariableName(
        opts.name
      )}.${format}.${env}.js`,
      // Pass through the file format
      format,
      // Do not let Rollup call Object.freeze() on namespace import objects
      // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
      freeze: false,
      // Do not let Rollup add a `__esModule: true` property when generating exports for non-ESM formats.
      esModule: false,
      // Rollup has treeshaking by default, but we can optimize it further...
      treeshake: {
        // We assume reading a property of an object never has side-effects.
        // This means tsdx WILL remove getters and setters on objects.
        //
        // @example
        //
        // const foo = {
        //  get bar() {
        //    console.log('effect');
        //    return 'bar';
        //  }
        // }
        //
        // const result = foo.bar;
        // const illegalAccess = foo.quux.tooDeep;
        //
        // Punchline....Don't use getters and setters
        propertyReadSideEffects: false,
      },
      name: opts.name || safeVariableName(opts.name),
      sourcemap: true,
      globals: { react: 'React', 'react-native': 'ReactNative' },
      exports: 'named',
    },
    plugins: [
      resolve({
        module: true,
        jsnext: true,
        browser: opts.target !== 'node',
      }),
      env === 'umd' &&
        commonjs({
          // use a regex to make sure to include eventual hoisted packages
          include: /\/node_modules\//,
        }),
      json(),
      typescript({
        typescript: require('typescript'),
        cacheRoot: `./.rts2_cache_${format}`,
        tsconfigDefaults: {
          compilerOptions: {
            sourceMap: true,
            declaration: true,
            jsx: 'react',
          },
        },
        tsconfigOverride: {
          compilerOptions: {
            target: 'esnext',
          },
        },
      }),
      babel(babelOptions),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      sourceMaps(),
      sizeSnapshot(),
      env === 'production' &&
        terser({
          sourcemap: true,
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
          },
          ecma: 5,
          toplevel: format === 'es' || format === 'cjs',
          warnings: true,
        }),
    ],
  };
};
