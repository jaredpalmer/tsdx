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
    extends: ['react-app'],
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
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
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
