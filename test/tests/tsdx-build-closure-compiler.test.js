/**
 * @jest-environment node
 */

const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const grep = (pattern, file) => {
  const output = shell.grep(pattern, file);
  const grepOutput = output.stdout.replace(`\n`, ``);
  return grepOutput.length > 0;
};

const stageName = 'stage-build-closure-compiler';

describe('tsdx build with closure compiler default options', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('should minify bundle with default options', () => {
    util.setupStageWithFixture(stageName, 'build-withConfig');

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

    const lib = require(`../../${stageName}/dist`);
    expect(lib.signature).toBe('bar 0');

    expect(
      grep(
        'exports.signature=signature',
        'dist/build-withconfig.cjs.production.min.js'
      )
    ).toBeTruthy();
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

    const lib = require(`../../${stageName}/dist`);
    expect(lib.signature).toBe('bar 0');

    // closure compiler with advanced optimization level
    // minifies bundle with `signature="bar 0"`
    expect(
      grep('bar 0', 'dist/build-withconfig.cjs.production.min.js')
    ).toBeTruthy();
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
