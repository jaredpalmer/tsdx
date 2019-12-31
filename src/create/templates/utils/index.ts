import { Template } from '../template';

interface ProjectArgs {
  name: string;
  author: string;
}
export const composePackageJson = (template: Template) => ({
  name,
  author,
}: ProjectArgs) => {
  return {
    ...template.packageJson,
    name,
    author,
    module: `dist/${name}.esm.js`,
  };
};
