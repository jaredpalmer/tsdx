import path from 'path';
import * as fs from 'fs-extra';
import { TsdxBag } from '../../types';
export async function fixGitignore({ projectPath }: TsdxBag) {
  await fs.move(
    path.resolve(projectPath, './gitignore'),
    path.resolve(projectPath, './.gitignore')
  );
}
