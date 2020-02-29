/**
 * @jest-environment node
 */

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
    expect(lib.__esModule).toBe(true);
  });

  it('should clean the dist directory before rebuilding', () => {
    util.setupStageWithFixture(stageName, 'build-default');

    shell.mv('package.json', 'package-og.json');
    shell.mv('package2.json', 'package.json');

    const output = shell.exec('node ../dist/index.js build --format esm,cjs');
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

  it('should fail gracefully with exit code 1 when build failed', () => {
    util.setupStageWithFixture(stageName, 'build-invalid');
    const code = shell.exec('node ../dist/index.js build').code;
    expect(code).toBe(1);
  });

  it('should only transpile and not type check', () => {
    util.setupStageWithFixture(stageName, 'build-invalid');
    const code = shell.exec('node ../dist/index.js build --transpileOnly').code;

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-invalid.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-invalid.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-invalid.esm.js')).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    expect(code).toBe(0);
  });

  it('should use the declarationDir when set in tsconfig', () => {
    util.setupStageWithFixture(stageName, 'build-withTsconfig');

    const output = shell.exec('node ../dist/index.js build --format esm,cjs');

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withtsconfig.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withtsconfig.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-withtsconfig.esm.js')).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeFalsy();
    expect(shell.test('-f', 'typings/index.d.ts')).toBeTruthy();
    expect(shell.test('-f', 'typings/index.d.ts.map')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should set __esModule according to esModuleInterop in tsconfig', () => {
    util.setupStageWithFixture(stageName, 'build-withTsconfig');

    const output = shell.exec('node ../dist/index.js build --format cjs');

    const lib = require(`../../${stageName}/dist/build-withtsconfig.cjs.production.min.js`);
    // if esModuleInterop: false, no __esModule is added, therefore undefined
    expect(lib.__esModule).toBe(undefined);

    expect(output.code).toBe(0);
  });

  it('should read custom --tsconfig path', () => {
    util.setupStageWithFixture(stageName, 'build-withTsconfig');

    const output = shell.exec(
      'node ../dist/index.js build --format cjs --tsconfig ./src/tsconfig.json'
    );

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withtsconfig.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withtsconfig.cjs.production.min.js')
    ).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeFalsy();
    expect(shell.test('-f', 'typingsCustom/index.d.ts')).toBeTruthy();
    expect(shell.test('-f', 'typingsCustom/index.d.ts.map')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
