/**
 * @jest-environment node
 */
'use strict';

const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const stageName = 'stage-build';

describe('tsdx build', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('should compile files into a dist directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');

    const output = shell.exec('node ../dist/index.js build --format esm,cjs');

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-default.esm.js')).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should create the library correctly', () => {
    util.setupStageWithFixture(stageName, 'build-default');

    shell.exec('node ../dist/index.js build');

    const lib = require(`../../${stageName}/dist`);
    expect(lib.foo()).toBe('bar');
  });

  it('should fail gracefully with exit code 1 when build failed', () => {
    util.setupStageWithFixture(stageName, 'build-invalid');
    const code = shell.exec('node ../dist/index.js build').code;
    expect(code).toBe(1);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
