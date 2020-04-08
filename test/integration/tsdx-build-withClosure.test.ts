import * as shell from 'shelljs';
import * as util from '../utils/fixture';
import { grep } from '../utils/shell';

shell.config.silent = false;

const testDir = 'integration';
const fixtureName = 'build-withClosure';
const stageName = `stage-integration-${fixtureName}`;

describe('integration :: tsdx build :: --closureCompiler', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });
  beforeEach(() => {
    util.setupStageWithFixture(testDir, stageName, fixtureName);
  });

  it('should minify bundle with default options', () => {
    let output = shell.exec('node ../dist/index.js build --closureCompiler');
    expect(output.code).toBe(0);

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withclosure.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withclosure.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-withclosure.esm.js')).toBeTruthy();

    const lib = require(`../../${stageName}/dist`);
    expect(lib.signature).toBe('bar 0');

    // with SIMPLE optimization level minified bundle should contain
    // simplePattern 'exports.signature=signature'
    expect(
      grep(/exports\.signature=signature/, [
        'dist/build-withclosure.cjs.production.min.js',
      ])
    ).toBeTruthy();
  });

  it('should minify bundle with advanced options', () => {
    shell.mv('-f', 'tsdx.config.closure-advanced.js', 'tsdx.config.js');

    const output = shell.exec('node ../dist/index.js build --closureCompiler');
    expect(output.code).toBe(0);

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withclosure.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withclosure.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-withclosure.esm.js')).toBeTruthy();

    const lib = require(`../../${stageName}/dist`);
    expect(lib.signature).toBe('bar 0');

    // with ADVANCED optimization level minified bundle should contain
    // advancedPattern 'exports.a="bar 0"'
    expect(
      grep(/exports\.a="bar 0"/, [
        'dist/build-withclosure.cjs.production.min.js',
      ])
    ).toBeTruthy();
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
