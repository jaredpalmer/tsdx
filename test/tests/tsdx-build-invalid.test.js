const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const fixtureName = 'build-invalid';
const stageName = `stage-${fixtureName}`;

describe('tsdx build :: invalid build', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(stageName, fixtureName);
  });

  it('should fail gracefully with exit code 1 when build failed', () => {
    const code = shell.exec('node ../dist/index.js build').code;
    expect(code).toBe(1);
  });

  it('should only transpile and not type check', () => {
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

  afterAll(() => {
    util.teardownStage(stageName);
  });
});
