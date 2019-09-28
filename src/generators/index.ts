import { TemplateStaticsBuilderOptions } from '../types';
import {
  generateChromeExtensionConfig,
  generateReactConfig,
  generateBasicConfig,
} from '.';

const generatorStrategy = {
  chrome: generateChromeExtensionConfig,
  react: generateReactConfig,
  basic: generateBasicConfig,
};

export async function generateProjectConfig<T>(
  opts: TemplateStaticsBuilderOptions
): Promise<T | any> {
  try {
    return await generatorStrategy[opts.template](opts);
  } catch (err) {
    return err;
  }
}

export * from './chrome';
export * from './basic';
export * from './react';
