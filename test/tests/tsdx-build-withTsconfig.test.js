const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const fixtureName = 'build-withTsconfig';
const stageName = `stage-${fixtureName}`;

describe('tsdx build :: build with custom tsconfig.json options', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(stageName, fixtureName);
  });

  it('should use the declarationDir when set', () => {
    const output = shell.exec('node ../dist/index.js build');

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
    const lib = require(`../../${stageName}/dist/build-withtsconfig.cjs.production.min.js`);
    // if esModuleInterop: false, no __esModule is added, therefore undefined
    expect(lib.__esModule).toBe(undefined);
  });

  it('should read custom --tsconfig path', () => {
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

  afterAll(() => {
    util.teardownStage(stageName);
  });
});
