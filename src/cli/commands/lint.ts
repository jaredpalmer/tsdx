import chalk from 'chalk';
import { CLIEngine } from 'eslint';
import { paths } from '../../constants';
import * as builder from '../../builders';
import { getAppPackageJson } from '../../helpers';
const appPackageJson = getAppPackageJson();

export async function lint(opts: {
  fix: boolean;
  'ignore-pattern': string;
  'write-file': boolean;
  _: string[];
}) {
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
