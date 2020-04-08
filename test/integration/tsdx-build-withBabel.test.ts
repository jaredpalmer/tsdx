import * as shell from 'shelljs';

import * as util from '../utils/fixture';
import { execWithCache, grep } from '../utils/shell';

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
    const output = execWithCache('node ../dist/index.js build');
    expect(output.code).toBe(0);

    // from styled.h1` to styled.h1(
    const matched = grep(/styled.h1\(/, ['dist/build-withbabel.*.js']);
    expect(matched).toBeTruthy();
  });

  // TODO: make this test work by allowing customization of plugin order
  it.skip('should remove comments in the CSS', () => {
    const output = execWithCache('node ../dist/index.js build');
    expect(output.code).toBe(0);

    // the "should be removed" comment shouldn't be there (gets error code)
    const matched = grep(/should be removed/, ['dist/build-withbabel.*.js']);
    expect(matched).toBeTruthy();
  });

  it('should add an import of regeneratorRuntime', () => {
    const output = execWithCache('node ../dist/index.js build');
    expect(output.code).toBe(0);

    const matched = grep(/@babel\/runtime\/regenerator/, [
      'dist/build-withbabel.*.js',
    ]);
    expect(matched).toBeTruthy();
  });

  it('should merge and apply presets', () => {
    const output = execWithCache('node ../dist/index.js build');
    expect(output.code).toBe(0);

    // ensures replace-identifiers was used
    const matched = grep(/replacedSum/, ['dist/build-withbabel.*.js']);
    expect(matched).toBeTruthy();
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
