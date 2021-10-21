import { Template } from './template';

import basicTemplate from './basic';
import { PackageJson } from 'type-fest';

const reactTemplate: Template = {
  name: 'react',
  dependencies: [
    ...basicTemplate.dependencies,
    '@types/react',
    '@types/react-dom',
    'react',
    'react-dom',
    '@tsconfig/create-react-app',
  ],
  packageJson: {
    ...basicTemplate.packageJson,
    peerDependencies: {
      react: '>=16',
    },
    scripts: {
      ...basicTemplate.packageJson.scripts,
      test: 'dts test --passWithNoTests',
    } as PackageJson['scripts'],
  },
};

export default reactTemplate;
