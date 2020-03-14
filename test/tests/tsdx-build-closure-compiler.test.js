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

  it('should minify bundle with default options', () => {
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

    // only closure compiler minifies bundle to `signature="bar 0"`
    output = shell.grep('bar 0', [
      'dist/build-withconfig.esm.production.min.js',
    ]);
    expect(/bar 0/.test(output.stdout)).toBeTruthy();
  });

  it('should minify bundle with advanced options', () => {
    util.setupStageWithFixture(stageName, 'build-withConfig');
    shell.mv('-f', 'tsdx.config.closure-advanced.js', 'tsdx.config.js');

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

    // only closure compiler minifies bundle to `signature="bar 0"`
    output = shell.grep('bar 0', [
      'dist/build-withconfig.esm.production.min.js',
    ]);
    expect(/bar 0/.test(output.stdout)).toBeTruthy();
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
