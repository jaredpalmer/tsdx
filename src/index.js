#!/usr/bin/env node

import sade from 'sade';
import glob from 'tiny-glob/sync';
import { rollup, watch } from 'rollup';
import asyncro from 'asyncro';
import chalk from 'chalk';
import util from 'util';
import fs from 'fs-extra';
import jest from 'jest';
import logError from './logError';
import path from 'path';
import mkdirp from 'mkdirp';
import execa from 'execa';
import ora from 'ora';
import { paths } from './constants';
import * as Messages from './messages';
import { createRollupConfig } from './createRollupConfig';
import { createJestConfig } from './createJestConfig';
import { safeVariableName, resolveApp, safePackageName } from './utils';
import * as Output from './output';
import { concatAllArray } from 'jpjs';

const prog = sade('tsdx');

let appPackageJson;
try {
  appPackageJson = fs.readJSONSync(resolveApp('package.json'));
} catch (e) {}

const stat = util.promisify(fs.stat);

export const isDir = name =>
  stat(name)
    .then(stats => stats.isDirectory())
    .catch(() => false);

export const isFile = name =>
  stat(name)
    .then(stats => stats.isFile())
    .catch(() => false);

async function jsOrTs(filename) {
  const extension = (await isFile(resolveApp(filename + '.ts')))
    ? '.ts'
    : (await isFile(resolveApp(filename + '.tsx')))
    ? '.tsx'
    : '.js';

  return resolveApp(`${filename}${extension}`);
}

async function getInputs(entries, source) {
  let inputs = [];
  let stub = [];
  stub
    .concat(
      entries && entries.length
        ? entries
        : (source && resolveApp(source)) ||
            ((await isDir(resolveApp('src'))) && (await jsOrTs('src/index')))
    )
    .map(file => glob(file))
    .forEach(input => inputs.push(input));

  return concatAllArray(inputs);
}
function createBuildConfigs(opts) {
  const multiEntry = opts.input.length > 1;
  return concatAllArray(
    opts.input.map(input => [
      opts.format.includes('cjs') &&
        createRollupConfig('cjs', 'development', {
          ...opts,
          input,
          name: multiEntry
            ? path.basename(input.replace('src/', ''), path.extname(input))
            : opts.name,
        }),
      opts.format.includes('cjs') &&
        createRollupConfig('cjs', 'production', {
          ...opts,
          input,
          name: multiEntry
            ? path.basename(input.replace('src/', ''), path.extname(input))
            : opts.name,
        }),
      opts.format.includes('es') &&
        createRollupConfig('es', 'production', {
          ...opts,
          input,
          name: multiEntry
            ? path.basename(input.replace('src/', ''), path.extname(input))
            : opts.name,
        }),
      opts.format.includes('umd') &&
        createRollupConfig('umd', 'development', {
          ...opts,
          input,
          name: multiEntry
            ? path.basename(input.replace('src/', ''), path.extname(input))
            : opts.name,
        }),
      opts.format.includes('umd') &&
        createRollupConfig('umd', 'production', {
          ...opts,
          input,
          name: multiEntry
            ? path.basename(input.replace('src/', ''), path.extname(input))
            : opts.name,
        }),
    ])
  );
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

prog
  .command('create <pkg>')
  .describe('Create a new package with TSDX')
  .action(async pkg => {
    const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`).start();

    try {
      const projectPath = fs.realpathSync(process.cwd()) + '/' + pkg;
      // copy the template
      await fs.copy(path.resolve(__dirname, '../template'), projectPath, {
        overwrite: true,
      });
      // fix gitignore
      await fs.move(
        path.resolve(projectPath, './gitignore'),
        path.resolve(projectPath, './.gitignore')
      );
      // Install deps
      process.chdir(projectPath);
      const safeName = safePackageName(pkg);
      const pkgJson = {
        name: safeName,
        version: '0.1.0',
        main: 'dist/index.js',
        'umd:main': `dist/${safeName}.umd.production.js`,
        module: `dist/${safeName}.es.production.js`,
        typings: 'dist/index.d.ts',
        files: ['dist'],
        scripts: {
          start: 'tsdx watch',
          build: 'tsdx build',
          prepare: 'npm run build',
          test: 'tsdx test',
        },
      };
      await fs.outputJSON(path.resolve(projectPath, 'package.json'), pkgJson);
      bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
      Messages.start(pkg);
    } catch (error) {
      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      logError(error);
      process.exit(1);
    }
    const deps = ['@types/jest', 'tsdx', 'typescript'];

    const installSpinner = ora(Messages.installing(deps)).start();
    try {
      await execa(`yarn`, ['add', ...deps, '--dev']);
      installSpinner.succeed('Installed dependecines');
      console.log(Messages.start(pkg));
    } catch (error) {
      installSpinner.fail('Failed to install dependencies');
      logError(error);
      process.exit(1);
    }
  });
const toArray = val => (Array.isArray(val) ? val : val == null ? [] : [val]);

prog
  .command('watch [...entries]')
  .describe('Rebuilds on any change')
  .option('--entry, -i', 'Entry module(s)')
  .example('watch --entry src/foo.tsx')
  .option('--target', 'Specify your target environment', 'web')
  .example('watch --target node')
  .option('--name', 'Specify name exposed in UMD builds')
  .example('watch --name Foo')
  .option('--format', 'Specify module format(s)', 'cjs,es,umd')
  .example('watch --format cjs,es')
  .action(async (str, opts) => {
    opts.name = opts.name || appPackageJson.name;
    opts.entries = toArray(str || opts.entry).concat(opts._);
    opts.input = await getInputs(opts.entries, appPackageJson.source);
    const multiEntry = opts.input.length > 1;
    const [cjsDev, cjsProd, ...otherConfigs] = createBuildConfigs(opts);
    if (opts.format.includes('cjs')) {
      try {
        asyncro.map(opts.input, async (input, index) => {
          const fileName = multiEntry
            ? path.basename(input.replace('src/', ''), path.extname(input))
            : safeVariableName(opts.name);
          await fs.writeFile(
            resolveApp(`dist/${multiEntry ? fileName : 'index'}.js`),
            `
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${fileName}.cjs.production.js')
} else {
  module.exports = require('./${fileName}.cjs.development.js')
}`,
            {
              overwrite: true,
            }
          );
        });
      } catch (e) {}
    }

    await watch(
      [cjsDev, cjsProd, ...otherConfigs].map(inputOptions => ({
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
  .command('build [...entries]')
  .describe('Build your project once and exit')
  .option('--entry, -i', 'Entry module(s)')
  .example('build --entry src/foo.tsx')
  .option('--target', 'Specify your target environment', 'web')
  .example('build --target node')
  .option('--name', 'Specify name exposed in UMD builds')
  .example('build --name Foo')
  .option('--format', 'Specify module format(s)', 'cjs,es,umd')
  .example('build --format cjs,es')
  .action(async opts => {
    opts.name = opts.name || appPackageJson.name;
    opts.input = await getInputs(opts.entry, appPackageJson.source);
    const [cjsDev, cjsProd, ...otherConfigs] = createBuildConfigs(opts);
    if (opts.format.includes('cjs')) {
      try {
        await fs.writeFile(
          resolveApp('dist/index.js'),
          `
         'use strict'

      if (process.env.NODE_ENV === 'production') {
        module.exports = require('./${safeVariableName(
          opts.name
        )}.cjs.production.js')
      } else {
        module.exports = require('./${safeVariableName(
          opts.name
        )}.cjs.development.js')
      }`,
          {
            overwrite: true,
          }
        );
      } catch (e) {}
    }
    try {
      await asyncro.map(
        [cjsDev, cjsProd, ...otherConfigs],
        async inputOptions => {
          let bundle = await rollup(inputOptions);
          await bundle.write(inputOptions.output);
        }
      );
      await moveTypes();
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

    argv.push(
      '--config',
      JSON.stringify({
        ...createJestConfig(
          relativePath => path.resolve(__dirname, '..', relativePath),
          paths.appRoot
        ),
        ...appPackageJson.jest,
      })
    );

    const [_skipTheWordTest, ...argsToPassToJestCli] = argv;
    jest.run(argsToPassToJestCli);
  });

prog.parse(process.argv);
