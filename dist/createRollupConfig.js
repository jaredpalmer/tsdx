"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRollupConfig = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const rollup_plugin_terser_1 = require("rollup-plugin-terser");
const core_1 = require("@babel/core");
const plugin_commonjs_1 = tslib_1.__importDefault(require("@rollup/plugin-commonjs"));
const plugin_json_1 = tslib_1.__importDefault(require("@rollup/plugin-json"));
const plugin_replace_1 = tslib_1.__importDefault(require("@rollup/plugin-replace"));
const plugin_node_resolve_1 = tslib_1.__importStar(require("@rollup/plugin-node-resolve"));
const rollup_plugin_sourcemaps_1 = tslib_1.__importDefault(require("rollup-plugin-sourcemaps"));
const rollup_plugin_typescript2_1 = tslib_1.__importDefault(require("rollup-plugin-typescript2"));
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const extractErrors_1 = require("./errors/extractErrors");
const babelPluginTsdx_1 = require("./babelPluginTsdx");
const errorCodeOpts = {
    errorMapFilePath: constants_1.paths.appErrorsJson,
};
// shebang cache map thing because the transform only gets run once
let shebang = {};
async function createRollupConfig(opts, outputNum) {
    const findAndRecordErrorCodes = await extractErrors_1.extractErrors(Object.assign(Object.assign({}, errorCodeOpts), opts));
    const shouldMinify = opts.minify !== undefined ? opts.minify : opts.env === 'production';
    const outputName = [
        `${constants_1.paths.appDist}/${utils_1.safePackageName(opts.name)}`,
        opts.format,
        opts.env,
        shouldMinify ? 'min' : '',
        'js',
    ]
        .filter(Boolean)
        .join('.');
    const tsconfigPath = opts.tsconfig || constants_1.paths.tsconfigJson;
    // borrowed from https://github.com/facebook/create-react-app/pull/7248
    const tsconfigJSON = typescript_1.default.readConfigFile(tsconfigPath, typescript_1.default.sys.readFile).config;
    // borrowed from https://github.com/ezolenko/rollup-plugin-typescript2/blob/42173460541b0c444326bf14f2c8c27269c4cb11/src/parse-tsconfig.ts#L48
    const tsCompilerOptions = typescript_1.default.parseJsonConfigFileContent(tsconfigJSON, typescript_1.default.sys, './').options;
    return {
        // Tell Rollup the entry point to the package
        input: opts.input,
        // Tell Rollup which packages to ignore
        external: (id) => {
            // bundle in polyfills as TSDX can't (yet) ensure they're installed as deps
            if (id.startsWith('regenerator-runtime')) {
                return false;
            }
            return utils_1.external(id);
        },
        // Rollup has treeshaking by default, but we can optimize it further...
        treeshake: {
            // We assume reading a property of an object never has side-effects.
            // This means tsdx WILL remove getters and setters defined directly on objects.
            // Any getters or setters defined on classes will not be effected.
            //
            // @example
            //
            // const foo = {
            //  get bar() {
            //    console.log('effect');
            //    return 'bar';
            //  }
            // }
            //
            // const result = foo.bar;
            // const illegalAccess = foo.quux.tooDeep;
            //
            // Punchline....Don't use getters and setters
            propertyReadSideEffects: false,
        },
        // Establish Rollup output
        output: {
            // Set filenames of the consumer's package
            file: outputName,
            // Pass through the file format
            format: opts.format,
            // Do not let Rollup call Object.freeze() on namespace import objects
            // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
            freeze: false,
            // Respect tsconfig esModuleInterop when setting __esModule.
            esModule: Boolean(tsCompilerOptions === null || tsCompilerOptions === void 0 ? void 0 : tsCompilerOptions.esModuleInterop),
            name: opts.name || utils_1.safeVariableName(opts.name),
            sourcemap: true,
            globals: { react: 'React', 'react-native': 'ReactNative' },
            exports: 'named',
        },
        plugins: [
            !!opts.extractErrors && {
                async transform(source) {
                    await findAndRecordErrorCodes(source);
                    return source;
                },
            },
            plugin_node_resolve_1.default({
                mainFields: [
                    'module',
                    'main',
                    opts.target !== 'node' ? 'browser' : undefined,
                ].filter(Boolean),
                extensions: [...plugin_node_resolve_1.DEFAULTS.extensions, '.jsx'],
            }),
            // all bundled external modules need to be converted from CJS to ESM
            plugin_commonjs_1.default({
                // use a regex to make sure to include eventual hoisted packages
                include: opts.format === 'umd'
                    ? /\/node_modules\//
                    : /\/regenerator-runtime\//,
            }),
            plugin_json_1.default(),
            {
                // Custom plugin that removes shebang from code because newer
                // versions of bublé bundle their own private version of `acorn`
                // and I don't know a way to patch in the option `allowHashBang`
                // to acorn. Taken from microbundle.
                // See: https://github.com/Rich-Harris/buble/pull/165
                transform(code) {
                    let reg = /^#!(.*)/;
                    let match = code.match(reg);
                    shebang[opts.name] = match ? '#!' + match[1] : '';
                    code = code.replace(reg, '');
                    return {
                        code,
                        map: null,
                    };
                },
            },
            rollup_plugin_typescript2_1.default({
                typescript: typescript_1.default,
                tsconfig: opts.tsconfig,
                tsconfigDefaults: {
                    exclude: [
                        // all TS test files, regardless whether co-located or in test/ etc
                        '**/*.spec.ts',
                        '**/*.test.ts',
                        '**/*.spec.tsx',
                        '**/*.test.tsx',
                        // TS defaults below
                        'node_modules',
                        'bower_components',
                        'jspm_packages',
                        constants_1.paths.appDist,
                    ],
                    compilerOptions: {
                        sourceMap: true,
                        declaration: true,
                        jsx: 'react',
                    },
                },
                tsconfigOverride: {
                    compilerOptions: Object.assign({ 
                        // TS -> esnext, then leave the rest to babel-preset-env
                        target: 'esnext' }, (outputNum > 0
                        ? { declaration: false, declarationMap: false }
                        : {})),
                },
                check: !opts.transpileOnly && outputNum === 0,
                useTsconfigDeclarationDir: Boolean(tsCompilerOptions === null || tsCompilerOptions === void 0 ? void 0 : tsCompilerOptions.declarationDir),
            }),
            babelPluginTsdx_1.babelPluginTsdx({
                exclude: 'node_modules/**',
                extensions: [...core_1.DEFAULT_EXTENSIONS, 'ts', 'tsx'],
                passPerPreset: true,
                custom: {
                    targets: opts.target === 'node' ? { node: '10' } : undefined,
                    extractErrors: opts.extractErrors,
                    format: opts.format,
                },
                babelHelpers: 'bundled',
            }),
            opts.env !== undefined &&
                plugin_replace_1.default({
                    'process.env.NODE_ENV': JSON.stringify(opts.env),
                }),
            rollup_plugin_sourcemaps_1.default(),
            shouldMinify &&
                rollup_plugin_terser_1.terser({
                    sourcemap: true,
                    output: { comments: false },
                    compress: {
                        keep_infinity: true,
                        pure_getters: true,
                        passes: 10,
                    },
                    ecma: 5,
                    toplevel: opts.format === 'cjs',
                    warnings: true,
                }),
        ],
    };
}
exports.createRollupConfig = createRollupConfig;
