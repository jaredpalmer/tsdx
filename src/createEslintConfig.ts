import fs from 'fs';
import path from 'path';
import { CLIEngine } from 'eslint';
import reactAppConfig from 'eslint-config-react-app';

interface CreateEslintConfigArgs {
  rootDir: string;
  writeFile: boolean;
}
export function createEslintConfig({
  rootDir,
  writeFile,
}: CreateEslintConfigArgs): CLIEngine.Options['baseConfig'] {
  /*
  This config could change to
  {
    extends: [
      'react-app',
      'prettier/@typescript-eslint', 
      'plugin:prettier/recommended'
    ]
  }
  after https://github.com/facebook/create-react-app/commit/24489ac0a667af416f1d59dd806dfc2623aabe36 is released
  eslint-config-react-app defines overrides as an object instead of an array, which is not supported in eslint@6.
  */
  const config = {
    ...reactAppConfig,
    extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],
    overrides: undefined,
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: reactAppConfig.overrides.parserOptions,
    plugins: [
      ...reactAppConfig.plugins,
      ...reactAppConfig.overrides.plugins,
      'no-for-of-loops',
    ],
    rules: {
      ...reactAppConfig.rules,
      ...reactAppConfig.overrides.rules,
    },
  };

  if (writeFile) {
    const file = path.join(rootDir, '.eslintrc.js');
    if (fs.existsSync(file)) {
      console.error(
        'Error trying to save the Eslint configuration file:',
        `${file} already exists.`
      );
    } else {
      try {
        fs.writeFileSync(
          file,
          `module.exports = ${JSON.stringify(config, null, 2)}`
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  return config;
}
