import * as fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { CLIEngine } from 'eslint';

import { paths } from '../constants';
import { appPackageJson } from '../files';

import { createEslintConfig } from './createEslintConfig';

export function addLintCommand(prog: any) {
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
    .action(lintAction);
}

async function lintAction(opts: {
  fix: boolean;
  'ignore-pattern': string;
  'write-file': boolean;
  'report-file': string;
  _: string[];
}) {
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
