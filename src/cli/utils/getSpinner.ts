import ora from 'ora';
import chalk from 'chalk';

const spinners = {
  boot: (pkg: string) => ora(`Creating ${chalk.bold.green(pkg)}...`),
  install: (pkg: string) => ora(pkg),
};

export function getSpinner(type: 'boot' | 'install', msg: string) {
  return spinners[type](msg);
}
