import chalk from 'chalk';
import { Input } from 'enquirer';
import * as fs from 'fs-extra';

export async function getProjectPath({
  pkg,
  bootSpinner,
}: {
  pkg: string;
  bootSpinner: any;
}): Promise<string> {
  let projectPath = fs.realpathSync(process.cwd()) + '/' + pkg;
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
    return getProjectPath({ pkg: projectPath, bootSpinner }); // recursion!
  } else {
    return projectPath;
  }
}
