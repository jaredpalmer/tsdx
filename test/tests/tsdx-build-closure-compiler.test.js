/**
 * @jest-environment node
 */

const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const stageName = 'stage-build-closure-compiler';

const cjsBundleDev = 'dist/build-withconfig.cjs.development.js';
const cjsBundleProd = 'dist/build-withconfig.cjs.production.min.js';
const esmBundle = 'dist/build-withconfig.esm.js';

const simplePattern = /exports\.signature=signature/;
const advancedPattern = /exports\.a="bar 0"/;

describe('tsdx build with closure compiler', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('should minify bundle with default options', () => {
    util.setupStageWithFixture(stageName, 'build-withConfig');

    let output = shell.exec('node ../dist/index.js build --closureCompiler');
    expect(output.code).toBe(0);

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    expect(shell.test('-f', cjsBundleDev)).toBeTruthy();
    expect(shell.test('-f', cjsBundleProd)).toBeTruthy();
    expect(shell.test('-f', esmBundle)).toBeTruthy();

    const lib = require(`../../${stageName}/dist`);
    expect(lib.signature).toBe('bar 0');

    // with SIMPLE optimization level minified bundle should contain
    // simplePattern 'exports.signature=signature'
    expect(util.grep(simplePattern, cjsBundleProd)).toBeTruthy();
    expect(util.grep(advancedPattern, cjsBundleProd)).toBeFalsy();
  });

  it('should minify bundle with advanced options', () => {
    util.setupStageWithFixture(stageName, 'build-withConfig');
    shell.mv('-f', 'tsdx.config.closure-advanced.js', 'tsdx.config.js');

    let output = shell.exec('node ../dist/index.js build --closureCompiler');
    expect(output.code).toBe(0);

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    expect(shell.test('-f', cjsBundleDev)).toBeTruthy();
    expect(shell.test('-f', cjsBundleProd)).toBeTruthy();
    expect(shell.test('-f', esmBundle)).toBeTruthy();

    const lib = require(`../../${stageName}/dist`);
    expect(lib.signature).toBe('bar 0');

    // with ADVANCED optimization level minified bundle should contain
    // advancedPattern 'exports.a="bar 0"'
    expect(util.grep(simplePattern, cjsBundleProd)).toBeFalsy();
    expect(util.grep(advancedPattern, cjsBundleProd)).toBeTruthy();
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
