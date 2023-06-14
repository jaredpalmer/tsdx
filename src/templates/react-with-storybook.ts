import { Template } from './template';
import reactTemplate from './react';
import { PackageJson } from 'type-fest';

const storybookTemplate: Template = {
  dependencies: [
    ...reactTemplate.dependencies,
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-info',
    '@storybook/addons',
    '@storybook/react',
    '@storybook/react-webpack5',
    'react-is',
    'babel-loader',
    'storybook',
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
