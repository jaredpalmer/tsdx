import { createConfigItem } from '@babel/core';
import babelPlugin from 'rollup-plugin-babel';
import merge from 'lodash.merge';

export const isTruthy = (obj?: any) => {
  if (!obj) {
    return false;
  }

  return obj.constructor !== Object || Object.keys(obj).length > 0;
};

const replacements = [{ original: 'lodash', replacement: 'lodash-es' }];

export const mergeConfigItems = (type: any, ...configItemsToMerge: any[]) => {
  const mergedItems: any[] = [];

  configItemsToMerge.forEach(configItemToMerge => {
    configItemToMerge.forEach((item: any) => {
      const itemToMergeWithIndex = mergedItems.findIndex(
        mergedItem => mergedItem.file.resolved === item.file.resolved
      );

      if (itemToMergeWithIndex === -1) {
        mergedItems.push(item);
        return;
      }

      mergedItems[itemToMergeWithIndex] = createConfigItem(
        [
          mergedItems[itemToMergeWithIndex].file.resolved,
          merge(mergedItems[itemToMergeWithIndex].options, item.options),
        ],
        {
          type,
        }
      );
    });
  });

  return mergedItems;
};

export const createConfigItems = (type: any, items: any[]) => {
  return items.map(({ name, ...options }) => {
    return createConfigItem([require.resolve(name), options], { type });
  });
};

export const babelPluginTsdx = babelPlugin.custom((babelCore: any) => ({
  // Passed the plugin options.
  options({ custom: customOptions, ...pluginOptions }: any) {
    return {
      // Pull out any custom options that the plugin might have.
      customOptions,

      // Pass the options back with the two custom options removed.
      pluginOptions,
    };
  },
  config(config: any, { customOptions }: any) {
    const defaultPlugins = createConfigItems(
      'plugin',
      [
        // {
        //   name: '@babel/plugin-transform-react-jsx',
        //   pragma: customOptions.jsx || 'h',
        //   pragmaFrag: customOptions.jsxFragment || 'Fragment',
        // },
        { name: 'babel-plugin-annotate-pure-calls' },
        { name: 'babel-plugin-dev-expression' },
        {
          name: 'babel-plugin-transform-rename-import',
          replacements,
        },
        isTruthy(customOptions.defines) && {
          name: 'babel-plugin-transform-replace-expressions',
          replace: customOptions.defines,
        },
        {
          name: 'babel-plugin-transform-async-to-promises',
          inlineHelpers: true,
          externalHelpers: true,
        },
        {
          name: '@babel/plugin-proposal-class-properties',
          loose: true,
        },
        {
          name: '@babel/plugin-transform-regenerator',
          async: false,
        },
        {
          name: 'babel-plugin-macros',
        },
        isTruthy(customOptions.extractErrors) && {
          name: './errors/transformErrorMessages',
        },
      ].filter(Boolean)
    );

    const babelOptions = config.options || {};

    const envIdx = (babelOptions.presets || []).findIndex((preset: any) =>
      preset.file.request.includes('@babel/preset-env')
    );

    if (envIdx !== -1) {
      const preset = babelOptions.presets[envIdx];
      babelOptions.presets[envIdx] = createConfigItem(
        [
          preset.file.resolved,
          merge(
            {
              loose: true,
              targets: customOptions.targets,
            },
            preset.options,
            {
              modules: false,
              exclude: merge(
                ['transform-async-to-generator', 'transform-regenerator'],
                preset.options.exclude || []
              ),
            }
          ),
        ],
        {
          type: `preset`,
        }
      );
    } else {
      babelOptions.presets = createConfigItems('preset', [
        {
          name: '@babel/preset-env',
          targets: customOptions.targets,
          modules: false,
          loose: true,
          exclude: ['transform-async-to-generator', 'transform-regenerator'],
        },
      ]);
    }

    // Merge babelrc & our plugins together
    babelOptions.plugins = mergeConfigItems(
      'plugin',
      defaultPlugins,
      babelOptions.plugins || []
    );

    return babelOptions;
  },
}));
