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
      'react-app',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
    ],
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
