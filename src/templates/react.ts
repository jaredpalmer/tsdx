import { Template } from './template';

import basicTemplate from './basic';
import { PackageJson } from 'type-fest';

const reactTemplate: Template = {
  name: 'react',
  dependencies: [
    ...basicTemplate.dependencies,
    '@types/react',
    '@types/react-dom',
    '@types/testing-library__react',
    '@types/testing-library__jest-dom',
    'react',
    'react-dom',
    '@testing-library/react',
    '@testing-library/jest-dom',
  ],
  packageJson: {
    ...basicTemplate.packageJson,
    peerDependencies: {
      react: '>=16',
    },
    scripts: {
      ...basicTemplate.packageJson.scripts,
      test: 'tsdx test --passWithNoTests',
    } as PackageJson['scripts'],
  },
};

export default reactTemplate;
