import ora from 'ora';
import {
  watch as rollupWatch,
  RollupWatchOptions,
  WatcherOptions,
} from 'rollup';
import chalk from 'chalk';

import {
  clearConsole,
  ensureDistFolder,
  writeCjsEntryFile,
  moveTypes,
} from '../../helpers';
import * as builder from '../../builders';
import { logError, normalizeOpts } from '../utils';

export async function watch(dirtyOpts: any) {
  const opts = await normalizeOpts(dirtyOpts);
  const { rollupConfig: buildConfigs } = builder.generateBuildConfig(opts);

  await ensureDistFolder();
  if (opts.format.includes('cjs')) {
    await writeCjsEntryFile(opts.name);
  }
  const spinner = ora().start();
  await rollupWatch(
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
}
