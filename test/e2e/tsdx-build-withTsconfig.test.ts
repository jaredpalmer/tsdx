import * as shell from 'shelljs';

import * as util from '../utils/fixture';
import { execWithCache } from '../utils/shell';

shell.config.silent = false;

const testDir = 'e2e';
const fixtureName = 'build-withTsconfig';
const stageName = `stage-${fixtureName}`;

describe('tsdx build :: build with custom tsconfig.json options', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(testDir, stageName, fixtureName);
  });

  it('should use the declarationDir when set', () => {
    const output = execWithCache('node ../dist/index.js build');

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

  it('should set __esModule according to esModuleInterop', () => {
    const output = execWithCache('node ../dist/index.js build');

    const lib = require(`../../${stageName}/dist/build-withtsconfig.cjs.production.min.js`);
    // if esModuleInterop: false, no __esModule is added, therefore undefined
    expect(lib.__esModule).toBe(undefined);

    expect(output.code).toBe(0);
  });

  it('should read custom --tsconfig path', () => {
    const output = execWithCache(
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

  afterAll(() => {
    util.teardownStage(stageName);
  });
});
