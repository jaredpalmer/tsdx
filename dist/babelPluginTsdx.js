"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.babelPluginTsdx = exports.createConfigItems = exports.mergeConfigItems = exports.isTruthy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@babel/core");
const plugin_babel_1 = require("@rollup/plugin-babel");
const lodash_merge_1 = tslib_1.__importDefault(require("lodash.merge"));
const isTruthy = (obj) => {
    if (!obj) {
        return false;
    }
    return obj.constructor !== Object || Object.keys(obj).length > 0;
};
exports.isTruthy = isTruthy;
// replace lodash with lodash-es, but not lodash/fp
const replacements = [{ original: 'lodash(?!/fp)', replacement: 'lodash-es' }];
const mergeConfigItems = (type, ...configItemsToMerge) => {
    const mergedItems = [];
    configItemsToMerge.forEach(configItemToMerge => {
        configItemToMerge.forEach((item) => {
            const itemToMergeWithIndex = mergedItems.findIndex(mergedItem => mergedItem.file.resolved === item.file.resolved);
            if (itemToMergeWithIndex === -1) {
                mergedItems.push(item);
                return;
            }
            mergedItems[itemToMergeWithIndex] = core_1.createConfigItem([
                mergedItems[itemToMergeWithIndex].file.resolved,
                lodash_merge_1.default(mergedItems[itemToMergeWithIndex].options, item.options),
            ], {
                type,
            });
        });
    });
    return mergedItems;
};
exports.mergeConfigItems = mergeConfigItems;
const createConfigItems = (type, items) => {
    return items.map((_a) => {
        var { name } = _a, options = tslib_1.__rest(_a, ["name"]);
        return core_1.createConfigItem([require.resolve(name), options], { type });
    });
};
exports.createConfigItems = createConfigItems;
exports.babelPluginTsdx = plugin_babel_1.createBabelInputPluginFactory(() => ({
    // Passed the plugin options.
    options(_a) {
        var { custom: customOptions } = _a, pluginOptions = tslib_1.__rest(_a, ["custom"]);
        return {
            // Pull out any custom options that the plugin might have.
            customOptions,
            // Pass the options back with the two custom options removed.
            pluginOptions,
        };
    },
    config(config, { customOptions }) {
        const defaultPlugins = exports.createConfigItems('plugin', [
            // {
            //   name: '@babel/plugin-transform-react-jsx',
            //   pragma: customOptions.jsx || 'h',
            //   pragmaFrag: customOptions.jsxFragment || 'Fragment',
            // },
            { name: 'babel-plugin-macros' },
            { name: 'babel-plugin-annotate-pure-calls' },
            { name: 'babel-plugin-dev-expression' },
            customOptions.format !== 'cjs' && {
                name: 'babel-plugin-transform-rename-import',
                replacements,
            },
            {
                name: 'babel-plugin-polyfill-regenerator',
                // don't pollute global env as this is being used in a library
                method: 'usage-pure',
            },
            {
                name: '@babel/plugin-proposal-class-properties',
                loose: true,
            },
            exports.isTruthy(customOptions.extractErrors) && {
                name: './errors/transformErrorMessages',
            },
        ].filter(Boolean));
        const babelOptions = config.options || {};
        babelOptions.presets = babelOptions.presets || [];
        const presetEnvIdx = babelOptions.presets.findIndex((preset) => preset.file.request.includes('@babel/preset-env'));
        // if they use preset-env, merge their options with ours
        if (presetEnvIdx !== -1) {
            const presetEnv = babelOptions.presets[presetEnvIdx];
            babelOptions.presets[presetEnvIdx] = core_1.createConfigItem([
                presetEnv.file.resolved,
                lodash_merge_1.default({
                    loose: true,
                    targets: customOptions.targets,
                }, presetEnv.options, {
                    modules: false,
                }),
            ], {
                type: `preset`,
            });
        }
        else {
            // if no preset-env, add it & merge with their presets
            const defaultPresets = exports.createConfigItems('preset', [
                {
                    name: '@babel/preset-env',
                    targets: customOptions.targets,
                    modules: false,
                    loose: true,
                },
            ]);
            babelOptions.presets = exports.mergeConfigItems('preset', defaultPresets, babelOptions.presets);
        }
        // Merge babelrc & our plugins together
        babelOptions.plugins = exports.mergeConfigItems('plugin', defaultPlugins, babelOptions.plugins || []);
        return babelOptions;
    },
}));
