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
import {
  safeVariableName,
  resolveApp,
  safePackageName,
  clearConsole,
} from './utils';
import * as Output from './output';
import { concatAllArray } from 'jpjs';
import getInstallCmd from './getInstallCmd';
import getInstallArgs from './getInstallArgs';
import { Input } from 'enquirer';
const pkg = require('../package.json');
const createLogger = require('progress-estimator');
// All configuration keys are optional, but it's recommended to specify a storage location.
// Learn more about configuration options below.
const logger = createLogger({
  storagePath: path.join(__dirname, '.progress-estimator'),
});

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
  return concatAllArray(
    opts.input.map(input => [
      opts.format.includes('cjs') &&
        createRollupConfig('cjs', 'development', { ...opts, input }),
      opts.format.includes('cjs') &&
        createRollupConfig('cjs', 'production', { ...opts, input }),
      opts.format.includes('es') &&
        createRollupConfig('es', 'production', { ...opts, input }),
      opts.format.includes('umd') &&
        createRollupConfig('umd', 'development', { ...opts, input }),
      opts.format.includes('umd') &&
        createRollupConfig('umd', 'production', { ...opts, input }),
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
  .version(pkg.version)
  .command('create <pkg>')
  .describe('Create a new package with TSDX')
  .action(async pkg => {
    const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`).start();

    // Helper fn to prompt the user for a different
    // folder name if one already exists
    async function getProjectPath(projectPath) {
      if (fs.existsSync(projectPath)) {
        bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
        const prompt = new Input({
          message: `A folder named ${chalk.bold.red(
            pkg
          )} already exists! ${chalk.bold('Choose a different name')}`,
          initial: pkg + '-1',
          result: v => v.trim(),
        });
        pkg = await prompt.run();
        projectPath = fs.realpathSync(process.cwd()) + '/' + pkg;
        bootSpinner.start(`Creating ${chalk.bold.green(pkg)}...`);
        return getProjectPath(projectPath); // recursion!
      } else {
        return projectPath;
      }
    }

    try {
      // get the project path
      let projectPath = await getProjectPath(
        fs.realpathSync(process.cwd()) + '/' + pkg
      );
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
          test: 'tsdx test',
        },
        husky: {
          hooks: {
            'pre-commit': 'pretty-quick --staged',
          },
        },
        prettier: {
          printWidth: 80,
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
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
    const deps = [
      '@types/jest',
      'husky',
      'pretty-quick',
      'prettier',
      'tsdx',
      'typescript',
    ];

    const installSpinner = ora(Messages.installing(deps)).start();
    try {
      const cmd = getInstallCmd();
      await execa(cmd, getInstallArgs(getInstallCmd(), deps));
      installSpinner.succeed('Installed dependecines');
      console.log(Messages.start(pkg));
    } catch (error) {
      installSpinner.fail('Failed to install dependencies');
      logError(error);
      process.exit(1);
    }
  });

prog
  .command('watch')
  .describe('Rebuilds on any change')
  .option('--entry, -i', 'Entry module(s)')
  .example('watch --entry src/foo.tsx')
  .option('--target', 'Specify your target environment', 'web')
  .example('watch --target node')
  .option('--name', 'Specify name exposed in UMD builds')
  .example('watch --name Foo')
  .option('--format', 'Specify module format(s)', 'cjs,es,umd')
  .example('watch --format cjs,es')
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
    const spinner = ora().start();
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
      if (event.code === 'START') {
        clearConsole();
        spinner.start(chalk.bold.cyan('Compiling modules...'));
      }
      if (event.code === 'ERROR') {
        spinner.fail(chalk.bold.red('Failed to compile'));
        logError(event.error);
      }
      if (event.code === 'FATAL') {
        spinner.fail(chalk.bold.red('Failed to compile'));
        logError(event.error);
      }
      if (event.code === 'END') {
        spinner.succeed(chalk.bold.green('Compiled successfully'));
        console.log(`
  ${chalk.dim('Watching for changes')}
`);
        try {
          await moveTypes();
        } catch (_error) {}
      }
    });
  });

prog
  .command('build')
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
        await mkdirp(resolveApp('./dist'));
        const promise = fs
          .writeFile(
            resolveApp('./dist/index.js'),
            `
         'use strict'

      if (process.env.NODE_ENV === 'production') {
        module.exports = require('./${safePackageName(
          opts.name
        )}.cjs.production.js')
      } else {
        module.exports = require('./${safePackageName(
          opts.name
        )}.cjs.development.js')
      }`,
            {
              overwrite: true,
            }
          )
          .catch(e => logError(e));
        logger(promise, 'Creating entry file');
      } catch (e) {
        logError(e);
      }
    }
    try {
      const promise = asyncro.map(
        [cjsDev, cjsProd, ...otherConfigs],
        async inputOptions => {
          let bundle = await rollup(inputOptions);
          await bundle.write(inputOptions.output);
          await moveTypes();
        }
      );
      logger(promise, 'Building modules');
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
