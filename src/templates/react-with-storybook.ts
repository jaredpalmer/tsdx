import { Template } from './template';
import reactTemplate from './react';
import { PackageJson } from 'type-fest';

const storybookTemplate: Template = {
  dependencies: [
    ...reactTemplate.dependencies,
    '@babel/core',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/react',
    '@storybook/react-webpack5',
    '@storybook/cli',
    'react-is',
    'babel-loader',
  ],
  name: 'react-with-storybook',
  packageJson: {
    ...reactTemplate.packageJson,
    scripts: {
      ...reactTemplate.packageJson.scripts,
      storybook: 'storybook dev -p 6006',
      'build-storybook': 'storybook build',
    } as PackageJson['scripts'],
  },
};

export default storybookTemplate;
