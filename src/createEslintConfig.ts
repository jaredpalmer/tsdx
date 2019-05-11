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
    extends: ['plugin:@typescript-eslint/recommended'],
    root: true,
    env: {
      node: true,
      es6: true,
      jest: true,
    },
    parserOptions: {
      ecmaVersion: 8,
      ecmaFeatures: {
        impliedStrict: true,
      },
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      indent: 'off',
      '@typescript-eslint/indent': ['error', 2],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
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
