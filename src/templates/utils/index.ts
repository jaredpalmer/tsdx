import { Template } from '../template';

interface ProjectArgs {
  safeName: string;
  author: string;
  pkg: string;
}

export const composePackageJson = (template: Template) => ({
  safeName,
  author,
  pkg,
}: ProjectArgs) => {
  return {
    ...template.packageJson,
    name: pkg,
    author,
    module: `dist/${safeName}.esm.js`,
  };
};
