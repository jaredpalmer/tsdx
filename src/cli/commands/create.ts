import execa from 'execa';
import chalk from 'chalk';
import * as Messages from '../messages';
import {
  getInstallCmd,
  getInstallArgs,
  logError,
  fixGitignore,
  copyTemplate,
  getTsdxBag,
} from '../utils';
import { generateProjectConfig } from '../../generators';

export async function create(pkg: string, opts: any) {
  Messages.displayWelcome();
  const tsdxBag = await getTsdxBag({ pkg, opts });
  const { bootSpinner, installSpinner, deps } = tsdxBag;

  try {
    bootSpinner.start();
    process.chdir(tsdxBag.projectPath);
    await copyTemplate(tsdxBag);
    await fixGitignore(tsdxBag);
    await generateProjectConfig(tsdxBag);
    bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
  } catch (error) {
    bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
    logError(error);
    process.exit(1);
  }

  try {
    installSpinner.start();
    const cmd = getInstallCmd();
    await execa(cmd, getInstallArgs(cmd, deps));
    installSpinner.succeed('Installed dependencies');
    Messages.displayNextSteps(tsdxBag);
  } catch (error) {
    installSpinner.fail('Failed to install dependencies');
    logError(error);
    process.exit(1);
  }
}
