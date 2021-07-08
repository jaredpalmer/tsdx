"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuildConfigs = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
const jpjs_1 = require("jpjs");
const constants_1 = require("./constants");
const createRollupConfig_1 = require("./createRollupConfig");
// check for custom tsdx.config.js
let tsdxConfig = {
    rollup(config, _options) {
        return config;
    },
};
if (fs.existsSync(constants_1.paths.appConfig)) {
    tsdxConfig = require(constants_1.paths.appConfig);
}
async function createBuildConfigs(opts) {
    const allInputs = jpjs_1.concatAllArray(opts.input.map((input) => createAllFormats(opts, input).map((options, index) => (Object.assign(Object.assign({}, options), { 
        // We want to know if this is the first run for each entryfile
        // for certain plugins (e.g. css)
        writeMeta: index === 0 })))));
    return await Promise.all(allInputs.map(async (options, index) => {
        // pass the full rollup config to tsdx.config.js override
        const config = await createRollupConfig_1.createRollupConfig(options, index);
        return tsdxConfig.rollup(config, options);
    }));
}
exports.createBuildConfigs = createBuildConfigs;
function createAllFormats(opts, input) {
    return [
        opts.format.includes('cjs') && Object.assign(Object.assign({}, opts), { format: 'cjs', env: 'development', input }),
        opts.format.includes('cjs') && Object.assign(Object.assign({}, opts), { format: 'cjs', env: 'production', input }),
        opts.format.includes('esm') && Object.assign(Object.assign({}, opts), { format: 'esm', input }),
        opts.format.includes('umd') && Object.assign(Object.assign({}, opts), { format: 'umd', env: 'development', input }),
        opts.format.includes('umd') && Object.assign(Object.assign({}, opts), { format: 'umd', env: 'production', input }),
        opts.format.includes('system') && Object.assign(Object.assign({}, opts), { format: 'system', env: 'development', input }),
        opts.format.includes('system') && Object.assign(Object.assign({}, opts), { format: 'system', env: 'production', input }),
    ].filter(Boolean);
}
