import { GluegunToolbox } from 'gluegun';
import chalk from 'chalk';

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.foo = () => {
    toolbox.print.info('called foo extension');
  };

  toolbox.logError = (err: any) => {
    const error = err.error || err;
    const description = `${
      error.name ? error.name + ': ' : ''
    }${error.message || error}`;
    const message = error.plugin
      ? error.plugin === 'rpt2'
        ? `(typescript) ${description}`
        : `(${error.plugin} plugin) ${description}`
      : description;

    console.error(chalk.bold.red(message));

    if (error.loc) {
      console.error();
      console.error(
        `at ${error.loc.file}:${error.loc.line}:${error.loc.column}`
      );
    }

    if (error.frame) {
      console.error();
      console.error(chalk.dim(error.frame));
    } else if (err.stack) {
      const headlessStack = error.stack.replace(message, '');
      console.error(chalk.dim(headlessStack));
    }

    console.error();
  };

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "tsdx" property),
  // tsdx.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "tsdx")
  // }
};
