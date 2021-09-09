import * as shell from 'shelljs';

import * as util from '../utils/fixture';
import { execWithCache, grep } from '../utils/shell';

shell.config.silent = false;

const testDir = 'e2e';
const fixtureName = 'build-default';
// create a second version of build-default's stage for concurrent testing
const stageName = 'stage-build-options';

describe('dts build :: options', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(testDir, stageName, fixtureName);
  });

  it('should compile all formats', () => {
    const output = execWithCache(
      'node ../dist/index.js build --format cjs,esm,umd,system'
    );

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-default.esm.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.umd.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.umd.production.min.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.system.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.system.production.min.js')
    ).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should not bundle regeneratorRuntime when targeting Node', () => {
    const output = execWithCache('node ../dist/index.js build --target node');
    expect(output.code).toBe(0);

    const matched = grep(/regeneratorRuntime = r/, ['dist/build-default.*.js']);
    expect(matched).toBeFalsy();
  });

  afterAll(() => {
    util.teardownStage(stageName);
  });
});
