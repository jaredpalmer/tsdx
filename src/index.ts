#!/usr/bin/env node

import sade from 'sade';
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
import * as fs from 'fs-extra';
import jest from 'jest';
import { CLIEngine } from 'eslint';
import logError from './logError';
import path from 'path';
import execa from 'execa';
import ora from 'ora';
import { paths } from './constants';
import * as Messages from './messages';
import getInstallCmd from './getInstallCmd';
import getInstallArgs from './getInstallArgs';
import { Input, Select } from 'enquirer';

import {
  logger,
  moveTypes,
  safePackageName,
  clearConsole,
  pkg,
  getInputs,
  ensureDistFolder,
  writeCjsEntryFile,
  getAppPackageJson,
} from './helpers';

import { generateProjectConfig } from './generators';
import * as builder from './builders';

const prog = sade('tsdx');
const appPackageJson = getAppPackageJson();

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
        choices: ['basic', 'react', 'chrome'],
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

      const tsdxBag = {
        safeName,
        template,
        logger,
        bootSpinner,
        version: '0.1.0',
        projectPath,
        paths,
      };

      await generateProjectConfig(tsdxBag);
      bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
      Messages.start(pkg);
    } catch (error) {
      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      logError(error);
      process.exit(1);
    }

    let deps = ['@types/jest', 'husky', 'tsdx', 'tslib', 'typescript'].sort();

    if (template === 'react') {
      deps = [
        ...deps,
        '@types/react',
        '@types/react-dom',
        'react',
        'react-dom',
      ].sort();
    }

    if (template === 'chrome') {
      deps = [
        ...deps,
        '@types/react',
        '@types/react-dom',
        'react',
        'react-dom',
        '@types/chrome',
      ];
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
    const { rollupConfig: buildConfigs } = builder.generateBuildConfig(opts);

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
    const { rollupConfig: buildConfigs } = builder.generateBuildConfig(opts);
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
        ...builder.createJestConfig(
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
  .example('lint --write-file')
  .action(
    (opts: {
      fix: boolean;
      'ignore-pattern': string;
      'write-file': boolean;
      _: string[];
    }) => {
      if (opts['_'].length === 0 && !opts['write-file']) {
        const defaultInputs = ['src', 'test'];
        opts['_'] = defaultInputs;
        console.log(
          chalk.yellow(
            `No input files specified, defaulting to ${defaultInputs.join(' ')}`
          )
        );
      }

      const cli = new CLIEngine({
        baseConfig: {
          ...builder.createEslintConfig({
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
