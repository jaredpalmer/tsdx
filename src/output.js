import { eraseLine } from 'ansi-escapes';
import chalk from 'chalk';
import ora from 'ora';
import ms from 'ms';

// This was copied from Razzle. Lots of unused stuff.
export const info = msg => {
  console.log(`${chalk.gray('>')} ${msg}`);
};

export const error = msg => {
  if (msg instanceof Error) {
    msg = msg.message;
  }

  console.error(`${chalk.red('> Error!')} ${msg}`);
};

export const success = msg => {
  console.log(`${chalk.green('> Success!')} ${msg}`);
};

export const time = () => {
  const start = new Date();
  return chalk.gray(`[${ms(new Date() - start)}]`);
};

export const wait = msg => {
  const spinner = ora(chalk.green(msg));
  spinner.color = 'blue';
  spinner.start();

  return () => {
    spinner.stop();
    process.stdout.write(eraseLine);
  };
};

export const prompt = opts => {
  return new Promise((resolve, reject) => {
    opts.forEach((val, i) => {
      const text = val[1];
      console.log(`${chalk.gray('>')} [${chalk.bold(i + 1)}] ${text}`);
    });

    const ondata = v => {
      const s = v.toString();

      function cleanup() {
        process.stdin.setRawMode(false);
        process.stdin.removeListener('data', ondata);
      }

      if (s === '\u0003') {
        cleanup();
        reject(new Error('Aborted'));
        return;
      }

      const n = Number(s);
      if (opts[n - 1]) {
        cleanup();
        resolve(opts[n - 1][0]);
      }
    };

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', ondata);
  });
};

export const cmd = cmd => {
  return chalk.bold(chalk.cyan(cmd));
};

export const code = cmd => {
  return `${chalk.gray('`')}${chalk.bold(cmd)}${chalk.gray('`')}`;
};

export const param = param => {
  return chalk.bold(`${chalk.gray('{')}${chalk.bold(param)}${chalk.gray('}')}`);
};
