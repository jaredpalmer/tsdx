#!/usr/bin/env node

const sade = require('sade');
const prog = sade('tsdx');
const fs = require('fs-extra');
const path = require('path');
const { rollup, watch } = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const json = require('rollup-plugin-json');
const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const sourceMaps = require('rollup-plugin-sourcemaps');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const asyncro = require('asyncro');
const logError = require('./logError');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// Remove the package name scope if it exists
const removeScope = name => name.replace(/^@.*\//, '');

const pkg = fs.readJSONSync(resolveApp('package.json'));

const paths = {
  appPkg: resolveApp('package.json'),
  appRoot: resolveApp('.'),
  appSrc: resolveApp('src/'),
  appEntry: resolveApp(pkg.source),
  appDist: resolveApp('dist'),
};

const external = id => !id.startsWith('.') && !id.startsWith('/');
const replacements = [{ original: 'lodash', replacement: 'lodash-es' }];
const babelOptions = {
  exclude: /node_modules/,
  plugins: [
    'annotate-pure-calls',
    'dev-expression',
    ['transform-rename-import', { replacements }],
  ],
};

const BUILD_CONFIGS = [
  getConfig('cjs', 'development'),
  getConfig('cjs', 'production'),
  getConfig('es', 'production'),
  getConfig('umd', 'development'),
  getConfig('umd', 'production'),
];

function getConfig(format, env) {
  return {
    // Tell Rollup the entry point to the package
    input: paths.appEntry,
    // Tell Rollup which packages to ignore
    external,
    // Establish Rollup output
    output: {
      // Set filenames of the consumer's package
      file: `${paths.appDist}/${pkg.name}.${format}.${env}.js`,
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
      sourcemap: true,
      globals: { react: 'React', 'react-native': 'ReactNative' },
      exports: 'named',
    },
    plugins: [
      resolve({
        module: true,
        jsnext: true,
        browser: true,
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
}

async function moveTypes() {
  try {
    // Move the typescript types to the base of the ./dist folder
    await fs.copy(paths.appDist + '/src', paths.appDist, {
      overwrite: true,
    });
    await fs.remove(paths.appDist + '/src');
  } catch (e) {}
}

prog.version(pkg.version);

prog
  .command('watch')
  .describe('Build your project in watch mode')
  .action(async opts => {
    await watch(
      BUILD_CONFIGS.map(inputOptions => ({
        watch: {
          silent: true,
          include: 'src/**',
          exclude: 'node_modules/**',
        },
        ...inputOptions,
      }))
    ).on('event', async event => {
      if (event.code === 'ERROR') {
        logError(event.error);
      }
      if (event.code === 'FATAL') {
        logError(event.error);
      }
      if (event.code === 'END') {
        try {
          await moveTypes();
        } catch (_error) {}
      }
    });
  });

prog
  .command('build')
  .describe('Build your project for production')
  .action(async opts => {
    try {
      await asyncro.map(BUILD_CONFIGS, async inputOptions => {
        let bundle = await rollup(inputOptions);
        const { code } = await bundle.write(inputOptions.output);
        return console.log(code.length);
      });
      await moveTypes();
    } catch (error) {
      logError(error);
    }
  });

prog.parse(process.argv);
