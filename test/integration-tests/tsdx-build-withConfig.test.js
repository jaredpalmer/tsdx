const shell = require('shelljs');
const fs = require('fs-extra');

const util = require('../utils/fixture');
const { execWithCache } = require('../utils/shell');

shell.config.silent = false;

const testDir = 'integration-tests';
const fixtureName = 'build-withConfig';
const stageName = `stage-integration-${fixtureName}`;

describe('integration :: tsdx build :: tsdx.config.js', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
    util.setupStageWithFixture(testDir, stageName, fixtureName);
  });

  it('should create a CSS file in the dist/ directory', () => {
    const output = execWithCache('node ../dist/index.js build');

    // TODO: this is kind of subpar naming, rollup-plugin-postcss just names it
    // the same as the output file, but with the .css extension
    expect(shell.test('-f', 'dist/build-withconfig.cjs.development.css'));

    expect(output.code).toBe(0);
  });

  it('should autoprefix and minify the CSS file', async () => {
    const output = execWithCache('node ../dist/index.js build');

    const cssText = await fs.readFile(
      './dist/build-withconfig.cjs.development.css'
    );

    // autoprefixed and minifed output
    expect(
      cssText.includes('.test::-webkit-input-placeholder{color:"blue"}')
    ).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should compile files into a dist directory', () => {
    const output = execWithCache('node ../dist/index.js build');

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withconfig.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-withconfig.cjs.production.min.js')
    ).toBeTruthy();
    expect(shell.test('-f', 'dist/build-withconfig.esm.js')).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  afterAll(() => {
    util.teardownStage(stageName);
  });
});
