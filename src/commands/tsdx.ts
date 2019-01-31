import { GluegunToolbox } from 'gluegun';
import { watch, RollupWatchOptions } from 'rollup';
import { createRollupConfig } from '../config/createRollupConfig';

interface Options {
  format: string;
  name: string;
  target: 'web' | 'node';
  watch: boolean;
  input: string;
}

module.exports = {
  name: 'tsdx',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print,
      parameters: { options: rawOptions },
    } = toolbox;

    const options: Options = {
      format: rawOptions.format || 'cjs,es,umd',
      target: rawOptions.target || 'web',
      name: rawOptions.name || '@todo',
      watch: rawOptions.watch || false,
      input: 'src/index.ts',
    };

    if (options.watch) {
      // watch mode
      const spinner = print.spin('Preparing...');
      await watch(
        [
          createRollupConfig(
            'cjs',
            'production',
            options
          ) as RollupWatchOptions,
        ].map(inputOptions => ({
          watch: {
            silent: true,
            include: ['src/**'],
            exclude: ['node_modules/**'],
            clearScreen: true,
          },
          ...inputOptions,
        }))
      ).on('event', async event => {
        if (event.code === 'START') {
          spinner.start('Building...');
        }
        if (event.code === 'ERROR') {
          spinner.fail(print.colors.error('Build failure'));
          toolbox.logError(event.error);
        }
        if (event.code === 'FATAL') {
          spinner.fail(print.colors.error('Build failure'));
          toolbox.logError(event.error);
        }
        if (event.code === 'END') {
          spinner.succeed('Build suceeded. Watching for changes....');
          // try {
          //   await moveTypes();
          // } catch (_error) {}
        }
      });
    }

    // const spinner = print.spin('Building...');
  },
};
