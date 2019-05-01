/**
 * @jest-environment node
 */
'use strict';

const shell = require('shelljs');
const util = require('../fixtures/util');
const kill = require('../utils/psKill');

shell.config.silent = false;

const stageName = 'stage-build';

describe('tsdx', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('tsdx build', () => {
    util.setupStageWithFixture(stageName, 'build-default');

    const output = shell.exec('node ../dist/index.js build');

    expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.cjs.production.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.es.production.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.umd.development.js')
    ).toBeTruthy();
    expect(
      shell.test('-f', 'dist/build-default.umd.development.js')
    ).toBeTruthy();

    expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

  it('tsdx watch', () => {
    util.setupStageWithFixture(stageName, 'build-default');

    let outputTest;
    const run = new Promise(resolve => {
      const child = shell.exec('../dist/index.js watch --verbose=true', () => {
        resolve(outputTest);
      });
      child.stdout.on('data', data => {
        if (data.includes('Watching for changes')) {
          shell.exec('sleep 3');
          outputTest = true;
          kill(child.pid);
        }
      });
    });
    return run.then(test => {
      expect(test).toBeTruthy();
      expect(shell.test('-f', 'dist/index.js')).toBeTruthy();
      expect(
        shell.test('-f', 'dist/build-default.cjs.development.js')
      ).toBeTruthy();
      expect(
        shell.test('-f', 'dist/build-default.cjs.production.js')
      ).toBeTruthy();
      expect(
        shell.test('-f', 'dist/build-default.es.production.js')
      ).toBeTruthy();
      expect(
        shell.test('-f', 'dist/build-default.umd.development.js')
      ).toBeTruthy();
      expect(
        shell.test('-f', 'dist/build-default.umd.development.js')
      ).toBeTruthy();

      expect(shell.test('-f', 'dist/index.d.ts')).toBeTruthy();
    });
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
