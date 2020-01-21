import { Template } from './template';
import reactTemplate from './react';
import { PackageJson } from 'type-fest';

const storybookTemplate: Template = {
  dependencies: [
    ...reactTemplate.dependencies,
    '@babel/core',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-info',
    '@storybook/addon-docs',
    '@storybook/addons',
    '@storybook/react',
    'react-docgen-typescript-loader',
    'react-is',
    'babel-loader',
    'ts-loader',
  ],
  name: 'react-with-storybook',
  packageJson: {
    ...reactTemplate.packageJson,
    scripts: {
      ...reactTemplate.packageJson.scripts,
      storybook: 'start-storybook -p 6006',
      'build-storybook': 'build-storybook',
    } as PackageJson['scripts'],
  },
};

export default storybookTemplate;
