import path from 'path';
import * as fs from 'fs-extra';
import { TsdxBag } from '../../types';

export async function copyTemplate({ projectPath, template }: TsdxBag) {
  await fs.copy(
    path.resolve(__dirname, `../templates/${template}`),
    projectPath,
    {
      overwrite: true,
    }
  );
}
