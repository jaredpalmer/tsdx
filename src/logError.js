'use strict';
const chalk = require('chalk');
const stdout = console.log.bind(console);
const stderr = console.error.bind(console);

module.exports = function logError(err) {
  const error = err.error || err;
  const description = `${error.name ? error.name + ': ' : ''}${error.message ||
    error}`;
  const message = error.plugin
    ? error.plugin === 'rpt2'
      ? `(typescript) ${description}`
      : `(${error.plugin} plugin) ${description}`
    : description;

  stderr(chalk.bold.red(message));

  if (error.loc) {
    stderr();
    stderr(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
  }

  if (error.frame) {
    stderr();
    stderr(chalk.dim(error.frame));
  } else if (err.stack) {
    const headlessStack = error.stack.replace(message, '');
    stderr(chalk.dim(headlessStack));
  }

  stderr();
};
