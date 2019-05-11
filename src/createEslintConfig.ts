import fs from 'fs';
import path from 'path';
import { CLIEngine } from 'eslint';

interface CreateEslintConfigArgs {
  rootDir: string;
  writeFile: boolean;
}
export function createEslintConfig({
  rootDir,
  writeFile,
}: CreateEslintConfigArgs): CLIEngine.Options['baseConfig'] {
  const config = {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
      'plugin:react/recommended',
    ],
    root: true,
    env: {
      node: true,
      es6: true,
      jest: true,
      browser: true,
    },
    parserOptions: {
      ecmaVersion: 2017,
      ecmaFeatures: {
        impliedStrict: true,
        jsx: true,
        experimentalObjectRestSpread: true,
      },
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      'no-console': 'off',
      'no-empty': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  if (writeFile && !fs.existsSync(path.join(rootDir, '.eslintrc.js')))
    fs.writeFile(
      path.join(rootDir, '.eslintrc.js'),
      `module.exports = ${JSON.stringify(config, null, 2)}`,
      err => {
        if (err) {
          console.error('Error trying to save the Eslint configuration file!');
        }
      }
    );

  return config;
}
