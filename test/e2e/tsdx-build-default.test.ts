import * as shell from 'shelljs';

import * as util from '../utils/fixture';
import { execWithCache } from '../utils/shell';

shell.config.silent = false;

const testDir = 'e2e';
const fixtureName = 'build-default';
const stageName = `stage-${fixtureName}`;

describe('tsdx build :: zero-config defaults', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(testDir, stageName, fixtureName);
  });

  it('should compile files into a dist directory', () => {
    const output = execWithCache('node ../dist/index.js build');

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

  it("shouldn't compile files in test/ or types/", () => {
    const output = execWithCache('node ../dist/index.js build');

    expect(shell.test('-d', 'dist/test/')).toBeFalsy();
    expect(shell.test('-d', 'dist/types/')).toBeFalsy();

    expect(output.code).toBe(0);
  });

  it('should create the library correctly', () => {
    const output = execWithCache('node ../dist/index.js build');

    const lib = require(`../../${stageName}/dist`);
    expect(lib.foo()).toBe('bar');
    expect(lib.__esModule).toBe(true);

    expect(output.code).toBe(0);
  });

  it('should clean the dist directory before rebuilding', () => {
    let output = execWithCache('node ../dist/index.js build');
    expect(output.code).toBe(0);

    shell.mv('package.json', 'package-og.json');
    shell.mv('package2.json', 'package.json');

    // cache bust because we want to re-run this command with new package.json
    output = execWithCache('node ../dist/index.js build', { noCache: true });
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
