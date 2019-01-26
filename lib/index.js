#!/usr/bin/env node

const sade = require('sade');
const { rollup, watch } = require('rollup');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const { terser } = require('rollup-plugin-terser');
const asyncro = require('asyncro');
const babel = require('rollup-plugin-babel');
const camelCase = require('camelcase');
const commonjs = require('rollup-plugin-commonjs');
const fs = require('fs-extra');
const jest = require('jest');
const json = require('rollup-plugin-json');
const logError = require('./logError');
const path = require('path');
const mkdirp = require('mkdirp');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const sourceMaps = require('rollup-plugin-sourcemaps');
const typescript = require('rollup-plugin-typescript2');
const execa = require('execa');

const prog = sade('tsdx');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// Remove the package name scope if it exists
const removeScope = name => name.replace(/^@.*\//, '');
// UMD-safe package name
const safeVariableName = name =>
  camelCase(
    removeScope(name)
      .toLowerCase()
      .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')
  );

const appPackageJson = fs.readJSONSync(resolveApp('package.json'));

const paths = {
  appPackageJson: resolveApp('package.json'),
  testsSetup: resolveApp('test/setupTests.ts'),
  appRoot: resolveApp('.'),
  appSrc: resolveApp('src'),
  appEntry: resolveApp(appPackageJson.source),
  appDist: resolveApp('dist'),
};

const overrides = Object.assign({}, appPackageJson.jest);

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

const getBuildConfigurations = opts => [
  getConfig('cjs', 'development', opts),
  getConfig('cjs', 'production', opts),
  getConfig('es', 'production', opts),
  getConfig('umd', 'development', opts),
  getConfig('umd', 'production', opts),
];

function getConfig(format, env, opts) {
  return {
    // Tell Rollup the entry point to the package
    input: paths.appEntry,
    // Tell Rollup which packages to ignore
    external,
    // Establish Rollup output
    output: {
      // Set filenames of the consumer's package
      file: `${paths.appDist}/${safeVariableName(
        appPackageJson.name
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
      name: opts.name || safeVariableName(appPackageJson.name),
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

// Add shared flags to watch and build commands imperatively
function addRollupCliFlagsToProg(cli) {
  cli
    .option('--target', 'Specify your target environment', 'web')
    .example('tsdx watch --target node')
    .option('--name', 'Specify name exposed in UMD builds');
}

prog.version(appPackageJson.version);
prog.command('watch').describe('Rebuilds on any change');

addRollupCliFlagsToProg(prog);

prog.action(async opts => {
  await watch(
    getBuildConfigurations(opts).map(inputOptions => ({
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
  .describe('Build your project once and exit')
  .action(async opts => {
    try {
      await asyncro.map(getBuildConfigurations(opts), async inputOptions => {
        let bundle = await rollup(inputOptions);
        await bundle.write(inputOptions.output);
      });
      await moveTypes();
    } catch (error) {
      logError(error);
    }
  });

prog
  .command('create <pkg>')
  .describe('Create a new package with TSDX')
  .action(async pkg => {
    try {
      console.log('Bootstrapping new project...');
      const projectPath = process.cwd() + '/' + pkg;
      // copy the template
      await fs.copy(path.resolve(__dirname, './template'), projectPath, {
        overwrite: true,
      });
      // fix gitignore
      await fs.move(
        path.resolve(projectPath, './gitignore'),
        path.resolve(projectPath, './.gitignore')
      );
      // Install deps
      process.chdir(projectPath);
      const safeName = safeVariableName(pkg);
      const pkgJson = {
        name: safeName,
        version: '0.1.0',
        source: 'src/index.ts',
        main: 'index.js',
        'umd:main': `dist/${safeName}.umd.production.js`,
        module: `dist/${safeName}.es.production.js`,
        typings: 'dist/index.d.ts',
        scripts: {
          start: 'tsdx watch',
          build: 'tsdx build',
          test: 'tsdx test',
        },
      };
      await fs.outputJSON(path.resolve(projectPath, 'package.json'), pkgJson);

      console.log('Installing dependencies...');

      await execa(`yarn`, [
        'add',
        '@types/jest',
        'tsdx',
        'typescript',
        '--dev',
      ]);
      console.log(`
Success!! TSDX just bootstrapped a brand new project for you. To get started, run:

      cd ${pkg}
      yarn start

      `);
    } catch (error) {
      logError(error);
    }
  });

prog
  .command('test')
  .describe(
    'Run jest test runner in watch mode. Passes through all flags directly to Jest'
  )
  .action(async opts => {
    // Do this as the first thing so that any code reading it knows the right env.
    process.env.BABEL_ENV = 'test';
    process.env.NODE_ENV = 'test';
    // Makes the script crash on unhandled rejections instead of silently
    // ignoring them. In the future, promise rejections that are not handled will
    // terminate the Node.js process with a non-zero exit code.
    process.on('unhandledRejection', err => {
      throw err;
    });

    const argv = process.argv.slice(2);

    // Watch unless on CI or in coverage mode
    if (!process.env.CI && argv.indexOf('--coverage') < 0) {
      // Use Jest --watchAll flag (instead of) --watch as of Jest 23+
      // @see https://github.com/wmonk/create-react-app-typescript/issues/282#issuecomment-379660648
      argv.push('--watchAll');
    }

    const maybeTestSetupFiledExists = await fs.exists(paths.testsSetup);
    const setupTestsFile = maybeTestSetupFiledExists
      ? '<rootDir>/src/setupTests.ts'
      : undefined;

    const createJestConfig = (resolve, rootDir) => {
      const overrides = appPackageJson.jest;
      return {
        transform: {
          '.(ts|tsx)': resolve('./node_modules/ts-jest'),
        },
        transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
        moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
        collectCoverageFrom: ['src/**/*.{ts,tsx}'],
        testMatch: ['<rootDir>/test/**/?(*.)(spec|test).{ts,tsx}'],
        ...overrides,
        rootDir,
      };
    };

    argv.push(
      '--config',
      JSON.stringify(
        createJestConfig(
          relativePath => path.resolve(__dirname, '..', relativePath),
          paths.appRoot
        )
      )
    );

    const [_skipTheWordTest, ...argsToPassToJestCli] = argv;
    jest.run(argsToPassToJestCli);
  });

prog.parse(process.argv);
