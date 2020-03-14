/**
 * @jest-environment node
 */

const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const stageName = 'stage-build-closure-compiler';

describe('tsdx build with closure compiler', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('should compile files with default options', () => {
    util.setupStageWithFixture(stageName, 'build-withConfig');
    shell.mv('-f', 'tsdx.config.closure-simple.js', 'tsdx.config.js');

    let output = shell.exec(
      'node ../dist/index.js build --env production --closureCompiler'
    );
    expect(output.code).toBe(0);

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withconfig.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withconfig.cjs.production.min.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withconfig.esm.production.min.js')
    ).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    output = shell.exec('node dist/index.js');
    expect(output.code).toBe(0);
    expect(/bar 0/.test(output.stdout)).toBeTruthy();
  });

  it('should compile files with advanced options', () => {
    util.setupStageWithFixture(stageName, 'build-withConfig');
    shell.mv('-f', 'tsdx.config.closure-advanced.js', 'tsdx.config.js');

    let output = shell.exec(
      'node ../dist/index.js build --env production --closureCompiler'
    );
    expect(output.code).toBe(0);

    // ensure we use closure-compiler instead of terser
    const plugins = require(`../../${stageName}/plugins.json`);
    expect(plugins.includes('closure-compiler')).toBeTruthy();
    expect(plugins.includes('terser')).toBeFalsy();

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withconfig.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withconfig.cjs.production.min.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withconfig.esm.production.min.js')
    ).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    output = shell.exec('node dist/index.js');
    expect(output.code).toBe(0);
    expect(/bar 0/.test(output.stdout)).toBeTruthy();
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
