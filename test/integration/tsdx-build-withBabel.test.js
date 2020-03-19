const shell = require('shelljs');

const util = require('../utils/fixture');
const { execWithCache } = require('../utils/shell');

shell.config.silent = false;

const testDir = 'integration';
const fixtureName = 'build-withBabel';
const stageName = `stage-integration-${fixtureName}`;

describe('integration :: tsdx build :: .babelrc.js', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(testDir, stageName, fixtureName);
  });

  it('should convert styled-components template tags', () => {
    let output = execWithCache('node ../dist/index.js build');
    expect(output.code).toBe(0);

    // from styled.h1` to styled.h1(
    output = shell.grep(/styled.h1\(/, ['dist/build-withbabel.*.js']);
    expect(output.code).toBe(0);
  });

  // TODO: make this test work by allowing customization of plugin order
  it.skip('should remove comments in the CSS', () => {
    let output = execWithCache('node ../dist/index.js build');
    expect(output.code).toBe(0);

    // the "should be removed" comment shouldn't be there (gets error code)
    output = shell.grep(/should be removed/, ['dist/build-withbabel.*.js']);
    expect(output.code).toBe(1);
  });

  it('should compile files into a dist directory', () => {
    const output = execWithCache('node ../dist/index.js build');

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withbabel.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withbabel.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-withbabel.esm.js')).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  afterAll(() => {
    util.teardownStage(stageName);
  });
});
