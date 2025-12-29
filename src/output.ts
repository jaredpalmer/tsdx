import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';
import ora from 'ora';

// This was copied from Razzle. Lots of unused stuff.
export const info = (msg: string) => {
  console.log(`${chalk.gray('>')} ${msg}`);
};

export const error = (msg: string | Error) => {
  if (msg instanceof Error) {
    msg = msg.message;
  }

  console.error(`${chalk.red('> Error!')} ${msg}`);
};

export const success = (msg: string) => {
  console.log(`${chalk.green('> Success!')} ${msg}`);
};

export const wait = (msg: string) => {
  const spinner = ora(chalk.green(msg));
  spinner.color = 'blue';
  spinner.start();

  return () => {
    spinner.stop();
    process.stdout.write(ansiEscapes.eraseLine);
  };
};

export const cmd = (cmd: string) => {
  return chalk.bold(chalk.cyan(cmd));
};

export const code = (cmd: string) => {
  return `${chalk.gray('`')}${chalk.bold(cmd)}${chalk.gray('`')}`;
};

export const param = (param: string) => {
  return chalk.bold(`${chalk.gray('{')}${chalk.bold(param)}${chalk.gray('}')}`);
};
