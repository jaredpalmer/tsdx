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
import execa from 'execa';
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
import { TsdxOptions } from './types';
const pkg = require('../package.json');
const createLogger = require('progress-estimator');
// All configuration keys are optional, but it's recommended to specify a storage location.
// Learn more about configuration options below.
const logger = createLogger({
  storagePath: path.join(__dirname, '.progress-estimator'),
});

const prog = sade('tsdx');

let appPackageJson: {
  name: string;
  source?: string;
  jest?: any;
  eslint?: any;
};

try {
  appPackageJson = fs.readJSONSync(resolveApp('package.json'));
} catch (e) {}

// check for custom tsdx.config.js
let tsdxConfig = {
  rollup(config: any, _options: any) {
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

function createBuildConfigs(
  opts: any
): Array<RollupOptions & { output: OutputOptions }> {
  return concatAllArray(
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
      ]
        .filter(Boolean)
        .map((options: TsdxOptions, index: number) => ({
          ...options,
          // We want to know if this is the first run for each entryfile
          // for certain plugins (e.g. css)
          writeMeta: index === 0,
        }))
    )
  ).map((options: TsdxOptions) =>
    // pass the full rollup config to tsdx.config.js override
    tsdxConfig.rollup(createRollupConfig(options), options)
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
  .option('--template', 'Specify a template. Allowed choices: [basic, react]')
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
      if (fs.existsSync(projectPath)) {
        bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
        const prompt = new Input({
          message: `A folder named ${chalk.bold.red(
            pkg
          )} already exists! ${chalk.bold('Choose a different name')}`,
          initial: pkg + '-1',
          result: (v: string) => v.trim(),
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

      const prompt = new Select({
        message: 'Choose a template',
        choices: ['basic', 'react'],
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
      // Install deps
      process.chdir(projectPath);
      const safeName = safePackageName(pkg);
      const pkgJson = {
        name: safeName,
        version: '0.1.0',
        main: 'dist/index.js',
        module: `dist/${safeName}.esm.js`,
        typings: 'dist/index.d.ts',
        files: ['dist'],
        scripts: {
          start: 'tsdx watch',
          build: 'tsdx build',
          test: template === 'react' ? 'tsdx test --env=jsdom' : 'tsdx test',
          lint: 'tsdx lint',
        },
        peerDependencies: template === 'react' ? { react: '>=16' } : {},
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

    let deps = [
      '@types/jest',
      'husky',
      'pretty-quick',
      'prettier',
      'tsdx',
      'tslib',
      'typescript',
    ].sort();

    if (template === 'react') {
      deps = [
        ...deps,
        '@types/react',
        '@types/react-dom',
        'react',
        'react-dom',
      ].sort();
    }

    const installSpinner = ora(Messages.installing(deps)).start();
    try {
      const cmd = getInstallCmd();
      await execa(cmd, getInstallArgs(cmd, deps));
      installSpinner.succeed('Installed dependencies');
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
  .option('--format', 'Specify module format(s)', 'cjs,esm')
  .example('watch --format cjs,esm')
  .option(
    '--verbose',
    'Keep outdated console output in watch mode instead of clearing the screen'
  )
  .example('watch --verbose')
  .option('--tsconfig', 'Specify custom tsconfig path')
  .example('watch --tsconfig ./tsconfig.foo.json')
  .option('--extractErrors', 'Extract invariant errors to ./errors/codes.json.')
  .example('build --extractErrors')
  .action(async (dirtyOpts: any) => {
    const opts = await normalizeOpts(dirtyOpts);
    const buildConfigs = createBuildConfigs(opts);
    await ensureDistFolder();
    if (opts.format.includes('cjs')) {
      await writeCjsEntryFile(opts.name);
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
      if (event.code === 'START') {
        if (!opts.verbose) {
          clearConsole();
        }
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
  .option('--format', 'Specify module format(s)', 'cjs,esm')
  .example('build --format cjs,esm')
  .option('--tsconfig', 'Specify custom tsconfig path')
  .example('build --tsconfig ./tsconfig.foo.json')
  .option(
    '--extractErrors',
    'Extract errors to ./errors/codes.json and provide a url for decoding.'
  )
  .example(
    'build --extractErrors=https://reactjs.org/docs/error-decoder.html?invariant='
  )
  .action(async (dirtyOpts: any) => {
    const opts = await normalizeOpts(dirtyOpts);
    const buildConfigs = createBuildConfigs(opts);
    await ensureDistFolder();
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
  return util.promisify(mkdirp)(resolveApp('dist'));
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
  return fs.writeFile(resolveApp(`./dist/index.js`), contents);
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
  .example('lint src test --write-file')
  .action(
    async (opts: {
      fix: boolean;
      'ignore-pattern': string;
      'write-file': boolean;
      _: string[];
    }) => {
      const cli = new CLIEngine({
        baseConfig: {
          ...createEslintConfig({
            rootDir: paths.appRoot,
            writeFile: opts['write-file'],
          }),
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
      if (report.errorCount) {
        process.exit(1);
      }
    }
  );

prog.parse(process.argv);
