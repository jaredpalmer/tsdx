#!/usr/bin/env node

const sade = require('sade');
const prog = sade('tsdx');
const fs = require('fs-extra');
const path = require('path');
const { rollup, watch } = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const sourceMaps = require('rollup-plugin-sourcemaps');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');

var PrettyError = require('pretty-error');
var pe = new PrettyError();

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

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

function getConfig(format, env) {
  return {
    input: paths.appEntry,
    external,
    output: {
      file: `${paths.appDist}/${pkg.name}.${format}.${env}.js`,
      format,
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
      commonjs({
        // use a regex to make sure to include eventual hoisted packages
        include: /\/node_modules\//,
      }),
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
  // Move the typescript types to the base of the ./dist folder
  await fs.copy(paths.appDist + '/src', paths.appDist, {
    overwrite: true,
  });
  await fs.remove(paths.appDist + '/src');
}

prog.version(pkg.version);

prog
  .command('watch')
  .describe('Build your project in watch mode')
  .action(async opts => {
    await watch(
      [
        getConfig('cjs', 'development'),
        getConfig('cjs', 'production'),
        getConfig('es', 'production'),
        getConfig('umd', 'development'),
        getConfig('umd', 'production'),
      ].map(inputOptions => ({
        watch: {
          include: 'src/**',
          exclude: 'node_modules/**',
        },
        ...inputOptions,
      }))
    ).on('event', async event => {
      if (event.code === 'ERROR') {
        console.log(pe.render(event.error));
      }
      if (event.code === 'FATAL') {
        console.log(pe.render(event.error));
      }
      if (event.code === 'END') {
        await moveTypes();
      }
    });
  });

prog
  .command('build')
  .describe('Build your project for production')
  .action(async opts => {
    await Promise.all(
      [
        getConfig('cjs', 'production'),
        getConfig('es', 'production'),
        getConfig('umd', 'development'),
        getConfig('umd', 'production'),
      ].map(async inputOptions => {
        let bundle = await rollup(inputOptions);
        await bundle.write(inputOptions.output);
      })
    );
    await moveTypes();
  });

prog.parse(process.argv);
