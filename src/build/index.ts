import * as fs from 'fs-extra';
import path from 'path';
import util from 'util';
import chalk from 'chalk';
import rimraf from 'rimraf';
import asyncro from 'asyncro';
import ora from 'ora';
import execa from 'execa';
import {
  rollup,
  watch,
  RollupOptions,
  OutputOptions,
  RollupWatchOptions,
  WatcherOptions,
} from 'rollup';
import glob from 'tiny-glob/sync';
import { concatAllArray } from 'jpjs';

import { paths } from '../constants';
import { appPackageJson } from '../files';
import logError from '../logError';
import { resolveApp, safePackageName, clearConsole } from '../utils';

import { WatchOpts, BuildOpts, ModuleFormat, NormalizedOpts } from './types';
import { createBuildConfigs } from './createBuildConfigs';
import { createProgressEstimator } from './createProgressEstimator';

export function addBuildCommand(prog: any) {
  prog
    .command('build')
    .describe('Build your project once and exit')
    .option('--entry, -i', 'Entry module(s)')
    .example('build --entry src/foo.tsx')
    .option('--target', 'Specify your target environment', 'browser')
    .example('build --target node')
    .option('--name', 'Specify name exposed in UMD builds')
    .example('build --name Foo')
    .option('--format', 'Specify module format(s)', 'cjs,esm')
    .example('build --format cjs,esm')
    .option('--tsconfig', 'Specify custom tsconfig path')
    .example('build --tsconfig ./tsconfig.foo.json')
    .option('--transpileOnly', 'Skip type checking', false)
    .example('build --transpileOnly')
    .option(
      '--extractErrors',
      'Extract errors to ./errors/codes.json and provide a url for decoding.'
    )
    .example(
      'build --extractErrors=https://reactjs.org/docs/error-decoder.html?invariant='
    )
    .action(buildAction);
}

export function addWatchCommand(prog: any) {
  prog
    .command('watch')
    .describe('Rebuilds on any change')
    .option('--entry, -i', 'Entry module(s)')
    .example('watch --entry src/foo.tsx')
    .option('--target', 'Specify your target environment', 'browser')
    .example('watch --target node')
    .option('--name', 'Specify name exposed in UMD builds')
    .example('watch --name Foo')
    .option('--format', 'Specify module format(s)', 'cjs,esm')
    .example('watch --format cjs,esm')
    .option(
      '--verbose',
      'Keep outdated console output in watch mode instead of clearing the screen'
    )
    .example('watch --verbose')
    .option('--noClean', "Don't clean the dist folder")
    .example('watch --noClean')
    .option('--tsconfig', 'Specify custom tsconfig path')
    .example('watch --tsconfig ./tsconfig.foo.json')
    .example('build --tsconfig ./tsconfig.foo.json')
    .option('--onFirstSuccess', 'Run a command on the first successful build')
    .example('watch --onFirstSuccess "echo The first successful build!"')
    .option('--onSuccess', 'Run a command on a successful build')
    .example('watch --onSuccess "echo Successful build!"')
    .option('--onFailure', 'Run a command on a failed build')
    .example('watch --onFailure "The build failed!"')
    .option('--transpileOnly', 'Skip type checking', false)
    .example('build --transpileOnly')
    .option(
      '--extractErrors',
      'Extract invariant errors to ./errors/codes.json.'
    )
    .example('build --extractErrors')
    .action(watchAction);
}

async function buildAction(dirtyOpts: BuildOpts) {
  const opts = await normalizeOpts(dirtyOpts);
  const buildConfigs = await createBuildConfigs(opts);
  await cleanDistFolder();
  const logger = await createProgressEstimator();
  if (opts.format.includes('cjs')) {
    const promise = writeCjsEntryFile(opts.name).catch(logError);
    logger(promise, 'Creating entry file');
  }
  try {
    const promise = asyncro
      .map(
        buildConfigs,
        async (inputOptions: RollupOptions & { output: OutputOptions }) => {
          let bundle = await rollup(inputOptions);
          await bundle.write(inputOptions.output);
          await moveTypes();
        }
      )
      .catch((e: any) => {
        throw e;
      });
    logger(promise, 'Building modules');
    await promise;
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

async function watchAction(dirtyOpts: WatchOpts) {
  const opts = await normalizeOpts(dirtyOpts);
  const buildConfigs = await createBuildConfigs(opts);
  if (!opts.noClean) {
    await cleanDistFolder();
  }
  opts.name = opts.name || appPackageJson.name;
  opts.input = await getInputs(opts.entry, appPackageJson.source);
  if (opts.format.includes('cjs')) {
    await writeCjsEntryFile(opts.name);
  }

  type Killer = execa.ExecaChildProcess | null;

  let firstTime = true;
  let successKiller: Killer = null;
  let failureKiller: Killer = null;

  function run(command?: string) {
    if (!command) {
      return null;
    }

    const [exec, ...args] = command.split(' ');
    return execa(exec, args, {
      stdio: 'inherit',
    });
  }

  function killHooks() {
    return Promise.all([
      successKiller ? successKiller.kill('SIGTERM') : null,
      failureKiller ? failureKiller.kill('SIGTERM') : null,
    ]);
  }

  const spinner = ora().start();
  await watch(
    (buildConfigs as RollupWatchOptions[]).map(inputOptions => ({
      watch: {
        silent: true,
        include: ['src/**'],
        exclude: ['node_modules/**'],
      } as WatcherOptions,
      ...inputOptions,
    }))
  ).on('event', async event => {
    // clear previous onSuccess/onFailure hook processes so they don't pile up
    await killHooks();

    if (event.code === 'START') {
      if (!opts.verbose) {
        clearConsole();
      }
      spinner.start(chalk.bold.cyan('Compiling modules...'));
    }
    if (event.code === 'ERROR') {
      spinner.fail(chalk.bold.red('Failed to compile'));
      logError(event.error);
      failureKiller = run(opts.onFailure);
    }
    if (event.code === 'FATAL') {
      spinner.fail(chalk.bold.red('Failed to compile'));
      logError(event.error);
      failureKiller = run(opts.onFailure);
    }
    if (event.code === 'END') {
      spinner.succeed(chalk.bold.green('Compiled successfully'));
      console.log(`
${chalk.dim('Watching for changes')}
`);

      try {
        await moveTypes();

        if (firstTime && opts.onFirstSuccess) {
          firstTime = false;
          run(opts.onFirstSuccess);
        } else {
          successKiller = run(opts.onSuccess);
        }
      } catch (_error) {}
    }
  });
}

async function normalizeOpts(opts: WatchOpts): Promise<NormalizedOpts> {
  return {
    ...opts,
    name: opts.name || appPackageJson.name,
    input: await getInputs(opts.entry, appPackageJson.source),
    format: opts.format.split(',').map((format: string) => {
      if (format === 'es') {
        return 'esm';
      }
      return format;
    }) as [ModuleFormat, ...ModuleFormat[]],
  };
}

async function getInputs(
  entries?: string | string[],
  source?: string
): Promise<string[]> {
  let inputs: string[] = [];
  let stub: any[] = [];
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

const isDir = (name: string) =>
  fs
    .stat(name)
    .then(stats => stats.isDirectory())
    .catch(() => false);

const isFile = (name: string) =>
  fs
    .stat(name)
    .then(stats => stats.isFile())
    .catch(() => false);

async function jsOrTs(filename: string) {
  const extension = (await isFile(resolveApp(filename + '.ts')))
    ? '.ts'
    : (await isFile(resolveApp(filename + '.tsx')))
    ? '.tsx'
    : '.js';

  return resolveApp(`${filename}${extension}`);
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

async function cleanDistFolder() {
  try {
    await util.promisify(fs.access)(paths.appDist);
    return util.promisify(rimraf)(paths.appDist);
  } catch {
    // if an exception is throw, the files does not exists or it is not visible
    // either way, we just return
    return;
  }
}

function writeCjsEntryFile(name: string) {
  const baseLine = `module.exports = require('./${safePackageName(name)}`;
  const contents = `
'use strict'

if (process.env.NODE_ENV === 'production') {
${baseLine}.cjs.production.min.js')
} else {
${baseLine}.cjs.development.js')
}
`;
  return fs.outputFile(path.join(paths.appDist, 'index.js'), contents);
}
