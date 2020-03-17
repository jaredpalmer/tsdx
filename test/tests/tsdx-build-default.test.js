const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const fixtureName = 'build-default';
const stageName = `stage-${fixtureName}`;

describe('tsdx build :: zero-config defaults', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(stageName, fixtureName);
  });

  it('should compile files into a dist directory', () => {
    const output = shell.exec('node ../dist/index.js build');

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
    const lib = require(`../../${stageName}/dist`);
    expect(lib.foo()).toBe('bar');
    expect(lib.__esModule).toBe(true);
  });

  it('should clean the dist directory before rebuilding', () => {
    shell.mv('package.json', 'package-og.json');
    shell.mv('package2.json', 'package.json');

    const output = shell.exec('node ../dist/index.js build');
    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();

    // build-default files have been cleaned out
    expect(
      shell.test('-f', 'dist/build-default.cjs.development.js')
    ).toBeFalsy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.production.min.js')
    ).toBeFalsy();
    expect(shell.test('-f', 'dist/build-default.esm.js')).toBeFalsy();

    // build-default-2 files have been added
    expect(
      shell.test('-f', 'dist/build-default-2.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default-2.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-default-2.esm.js')).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    expect(output.code).toBe(0);

    // reset package.json files
    shell.mv('package.json', 'package2.json');
    shell.mv('package-og.json', 'package.json');
  });

  afterAll(() => {
    util.teardownStage(stageName);
  });
});
