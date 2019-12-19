#!/usr/bin/env node

import sade from 'sade';
import glob from 'tiny-glob/sync';
import {
  rollup,
  watch,
  RollupOptions,
  OutputOptions,
  RollupWatchOptions,
  WatcherOptions,
} from 'rollup';
import asyncro from 'asyncro';
import chalk from 'chalk';
import util from 'util';
import * as fs from 'fs-extra';
import jest from 'jest';
import { CLIEngine } from 'eslint';
import logError from './logError';
import path from 'path';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import execa from 'execa';
import shell from 'shelljs';
import ora from 'ora';
import { paths } from './constants';
import * as Messages from './messages';
import { createRollupConfig } from './createRollupConfig';
import { createJestConfig } from './createJestConfig';
import { createEslintConfig } from './createEslintConfig';
import { resolveApp, safePackageName, clearConsole } from './utils';
import { concatAllArray } from 'jpjs';
import getInstallCmd from './getInstallCmd';
import getInstallArgs from './getInstallArgs';
import { Input, Select } from 'enquirer';
import { PackageJson, TsdxOptions } from './types';
import { createProgressEstimator } from './createProgressEstimator';
import { templates } from './templates';
import { composePackageJson } from './templates/utils';
const pkg = require('../package.json');

const prog = sade('tsdx');

let appPackageJson: PackageJson;

try {
  appPackageJson = fs.readJSONSync(resolveApp('package.json'));
} catch (e) {}

// check for custom tsdx.config.js
let tsdxConfig = {
  rollup(config: RollupOptions, _options: TsdxOptions): RollupOptions {
    return config;
  },
};

if (fs.existsSync(paths.appConfig)) {
  tsdxConfig = require(paths.appConfig);
}

export const isDir = (name: string) =>
  fs
    .stat(name)
    .then(stats => stats.isDirectory())
    .catch(() => false);

export const isFile = (name: string) =>
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

async function getInputs(entries: string[], source?: string) {
  let inputs: any[] = [];
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

async function createBuildConfigs(
  opts: any
): Promise<Array<RollupOptions & { output: OutputOptions }>> {
  return await Promise.all(
    concatAllArray(
      opts.input.map((input: string) =>
        [
          opts.format.includes('cjs') && {
            ...opts,
            format: 'cjs',
            env: 'development',
            input,
          },
          opts.format.includes('cjs') && {
            ...opts,
            format: 'cjs',
            env: 'production',
            input,
          },
          opts.format.includes('esm') && { ...opts, format: 'esm', input },
          opts.format.includes('umd') && {
            ...opts,
            format: 'umd',
            env: 'development',
            input,
          },
          opts.format.includes('umd') && {
            ...opts,
            format: 'umd',
            env: 'production',
            input,
          },
          opts.format.includes('system') && {
            ...opts,
            format: 'system',
            env: 'development',
            input,
          },
          opts.format.includes('system') && {
            ...opts,
            format: 'system',
            env: 'production',
            input,
          },
        ]
          .filter(Boolean)
          .map((options: TsdxOptions, index: number) => ({
            ...options,
            // We want to know if this is the first run for each entryfile
            // for certain plugins (e.g. css)
            writeMeta: index === 0,
          }))
      )
    ).map(async (options: TsdxOptions) => {
      // pass the full rollup config to tsdx.config.js override
      const config = await createRollupConfig(options);
      return tsdxConfig.rollup(config, options);
    })
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
  .example('create mypackage')
  .option(
    '--template',
    `Specify a template. Allowed choices: [${Object.keys(templates).join(
      ', '
    )}]`
  )
  .example('create --template react mypackage')
  .action(async (pkg: string, opts: any) => {
    console.log(
      chalk.blue(`
::::::::::: ::::::::  :::::::::  :::    :::
    :+:    :+:    :+: :+:    :+: :+:    :+:
    +:+    +:+        +:+    +:+  +:+  +:+
    +#+    +#++:++#++ +#+    +:+   +#++:+
    +#+           +#+ +#+    +#+  +#+  +#+
    #+#    #+#    #+# #+#    #+# #+#    #+#
    ###     ########  #########  ###    ###
`)
    );
    const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`);
    let template;
    // Helper fn to prompt the user for a different
    // folder name if one already exists
    async function getProjectPath(projectPath: string): Promise<string> {
      let exists = true;
      try {
        // will throw an exception if it does not exists
        await util.promisify(fs.access)(projectPath);
      } catch {
        exists = false;
      }
      if (!exists) {
        return projectPath;
      }
      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      const prompt = new Input({
        message: `A folder named ${chalk.bold.red(
          pkg
        )} already exists! ${chalk.bold('Choose a different name')}`,
        initial: pkg + '-1',
        result: (v: string) => v.trim(),
      });
      pkg = await prompt.run();
      projectPath = (await fs.realpath(process.cwd())) + '/' + pkg;
      bootSpinner.start(`Creating ${chalk.bold.green(pkg)}...`);
      return await getProjectPath(projectPath); // recursion!
    }

    try {
      // get the project path
      const realPath = await fs.realpath(process.cwd());
      let projectPath = await getProjectPath(realPath + '/' + pkg);

      const prompt = new Select({
        message: 'Choose a template',
        choices: Object.keys(templates),
      });

      if (opts.template) {
        template = opts.template.trim();
        if (!prompt.choices.includes(template)) {
          bootSpinner.fail(`Invalid template ${chalk.bold.red(template)}`);
          template = await prompt.run();
        }
      } else {
        template = await prompt.run();
      }

      bootSpinner.start();
      // copy the template
      await fs.copy(
        path.resolve(__dirname, `../templates/${template}`),
        projectPath,
        {
          overwrite: true,
        }
      );
      // fix gitignore
      await fs.move(
        path.resolve(projectPath, './gitignore'),
        path.resolve(projectPath, './.gitignore')
      );

      // update license year and author
      let license: string = await fs.readFile(
        path.resolve(projectPath, 'LICENSE'),
        { encoding: 'utf-8' }
      );

      license = license.replace(/<year>/, `${new Date().getFullYear()}`);

      // attempt to automatically derive author name
      let author = getAuthorName();

      if (!author) {
        bootSpinner.stop();
        const licenseInput = new Input({
          name: 'author',
          message: 'Who is the package author?',
        });
        author = await licenseInput.run();
        setAuthorName(author);
        bootSpinner.start();
      }

      license = license.replace(/<author>/, author.trim());

      await fs.writeFile(path.resolve(projectPath, 'LICENSE'), license, {
        encoding: 'utf-8',
      });

      const templateConfig = templates[template as keyof typeof templates];
      const generatePackageJson = composePackageJson(templateConfig);

      // Install deps
      process.chdir(projectPath);
      const safeName = safePackageName(pkg);
      const pkgJson = generatePackageJson({ name: safeName, author });
      await fs.outputJSON(path.resolve(projectPath, 'package.json'), pkgJson);
      bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
      await Messages.start(pkg);
    } catch (error) {
      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      logError(error);
      process.exit(1);
    }

    const templateConfig = templates[template as keyof typeof templates];
    const { dependencies: deps } = templateConfig;

    const installSpinner = ora(Messages.installing(deps.sort())).start();
    try {
      const cmd = await getInstallCmd();
      await execa(cmd, getInstallArgs(cmd, deps));
      installSpinner.succeed('Installed dependencies');
      console.log(await Messages.start(pkg));
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
  .option('--extractErrors', 'Extract invariant errors to ./errors/codes.json.')
  .example('build --extractErrors')
  .action(async (dirtyOpts: any) => {
    const opts = await normalizeOpts(dirtyOpts);
    const buildConfigs = await createBuildConfigs(opts);
    if (!opts.noClean) {
      await cleanDistFolder();
    }
    await ensureDistFolder();
    opts.name = opts.name || appPackageJson.name;
    opts.input = await getInputs(opts.entry, appPackageJson.source);
    if (opts.format.includes('cjs')) {
      await writeCjsEntryFile(opts.name);
    }

    type Killer = execa.ExecaChildProcess | null;

    let firstTime = true;
    let successKiller: Killer = null;
    let failureKiller: Killer = null;

    function run(command: string) {
      if (command) {
        const [exec, ...args] = command.split(' ');

        return execa(exec, args, {
          stdio: 'inherit',
        });
      }

      return null;
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
  .action(async (dirtyOpts: any) => {
    const opts = await normalizeOpts(dirtyOpts);
    const buildConfigs = await createBuildConfigs(opts);
    await cleanDistFolder();
    await ensureDistFolder();
    const logger = await createProgressEstimator();
    if (opts.format.includes('cjs')) {
      try {
        await util.promisify(mkdirp)(resolveApp('./dist'));
        const promise = writeCjsEntryFile(opts.name).catch(logError);
        logger(promise, 'Creating entry file');
      } catch (e) {
        logError(e);
      }
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
  });

async function normalizeOpts(opts: any) {
  return {
    ...opts,
    name: opts.name || appPackageJson.name,
    input: await getInputs(opts.entry, appPackageJson.source),
    format: opts.format.split(',').map((format: string) => {
      if (format === 'es') {
        return 'esm';
      }
      return format;
    }),
  };
}

function ensureDistFolder() {
  return util.promisify(mkdirp)(paths.appDist);
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
  return fs.writeFile(path.join(paths.appDist, 'index.js'), contents);
}

function getAuthorName() {
  let author = '';

  author = shell
    .exec('npm config get init-author-name', { silent: true })
    .stdout.trim();
  if (author) return author;

  author = shell
    .exec('git config --global user.name', { silent: true })
    .stdout.trim();
  if (author) {
    setAuthorName(author);
    return author;
  }

  author = shell
    .exec('npm config get init-author-email', { silent: true })
    .stdout.trim();
  if (author) return author;

  author = shell
    .exec('git config --global user.email', { silent: true })
    .stdout.trim();
  if (author) return author;

  return author;
}

function setAuthorName(author: string) {
  shell.exec(`npm config set init-author-name "${author}"`, { silent: true });
}

prog
  .command('test')
  .describe(
    'Run jest test runner in watch mode. Passes through all flags directly to Jest'
  )
  .action(async () => {
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
    let jestConfig = {
      ...createJestConfig(
        relativePath => path.resolve(__dirname, '..', relativePath),
        paths.appRoot
      ),
      ...appPackageJson.jest,
    };
    try {
      // Allow overriding with jest.config
      const jestConfigContents = require(paths.jestConfig);
      jestConfig = { ...jestConfig, ...jestConfigContents };
    } catch {}

    argv.push(
      '--config',
      JSON.stringify({
        ...jestConfig,
      })
    );

    if (!process.env.CI) {
      argv.push('--watch'); // run jest in watch mode unless in CI
    }

    const [, ...argsToPassToJestCli] = argv;
    jest.run(argsToPassToJestCli);
  });

prog
  .command('lint')
  .describe('Run eslint with Prettier')
  .example('lint src test')
  .option('--fix', 'Fixes fixable errors and warnings')
  .example('lint src test --fix')
  .option('--ignore-pattern', 'Ignore a pattern')
  .example('lint src test --ignore-pattern test/foobar.ts')
  .option('--write-file', 'Write the config file locally')
  .example('lint --write-file')
  .option('--report-file', 'Write JSON report to file locally')
  .example('lint --report-file eslint-report.json')
  .action(
    async (opts: {
      fix: boolean;
      'ignore-pattern': string;
      'write-file': boolean;
      'report-file': string;
      _: string[];
    }) => {
      if (opts['_'].length === 0 && !opts['write-file']) {
        const defaultInputs = ['src', 'test'].filter(fs.existsSync);
        opts['_'] = defaultInputs;
        console.log(
          chalk.yellow(
            `Defaulting to "tsdx lint ${defaultInputs.join(' ')}"`,
            '\nYou can override this in the package.json scripts, like "lint": "tsdx lint src otherDir"'
          )
        );
      }

      const config = await createEslintConfig({
        pkg: appPackageJson,
        rootDir: paths.appRoot,
        writeFile: opts['write-file'],
      });

      const cli = new CLIEngine({
        baseConfig: {
          ...config,
          ...appPackageJson.eslint,
        },
        extensions: ['.ts', '.tsx'],
        fix: opts.fix,
        ignorePattern: opts['ignore-pattern'],
      });
      const report = cli.executeOnFiles(opts['_']);
      if (opts.fix) {
        CLIEngine.outputFixes(report);
      }
      console.log(cli.getFormatter()(report.results));
      if (opts['report-file']) {
        await fs.mkdirs(path.dirname(opts['report-file']));

        await fs.writeFile(
          opts['report-file'],
          cli.getFormatter('json')(report.results)
        );
      }
      if (report.errorCount) {
        process.exit(1);
      }
    }
  );

prog.parse(process.argv);
