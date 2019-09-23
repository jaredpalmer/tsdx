/**
 * @jest-environment node
 */
'use strict';

const shell = require('shelljs');
const util = require('../../fixtures/util');

shell.config.silent = true;

const stageName = 'stage-lint';

describe('tsdx lint', () => {
  it('should fail to lint a ts file with errors', () => {
    const testFile = 'test/tests/lint/file-with-lint-errors.ts';
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(1);
    expect(output.stdout.includes('Parsing error:')).toBe(true);
  });

  it('should succeed linting a ts file without errors', () => {
    const testFile = 'test/tests/lint/file-without-lint-error.ts';
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(0);
  });

  it('should fail to lint a ts file with prettier errors', () => {
    const testFile = 'test/tests/lint/file-with-prettier-lint-errors.ts';
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(1);
    expect(output.stdout.includes('prettier/prettier')).toBe(true);
  });

  it('should fail to lint a tsx file with errors', () => {
    const testFile = 'test/tests/lint/react-file-with-lint-errors.tsx';
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(1);
    expect(output.stdout.includes('Parsing error:')).toBe(true);
  });

  it('should succeed linting a tsx file without errors', () => {
    const testFile = 'test/tests/lint/react-file-without-lint-error.tsx';
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(0);
  });

  it('should not lint', () => {
    const output = shell.exec(`node dist/index.js lint`);
    expect(output.code).toBe(1);
    expect(output.toString()).toContain('No input files specified, defaulting to src test');
  });

  describe('when --write-file is used', () => {
    beforeEach(() => {
      util.teardownStage(stageName);
      util.setupStageWithFixture(stageName, 'build-default');
    });

    it('should create the file', () => {
      const output = shell.exec(`node ../dist/index.js lint --write-file`);
      expect(shell.test('-f', '.eslintrc.js')).toBeTruthy();
      expect(output.code).toBe(0);
    });

    afterAll(() => {
      util.teardownStage(stageName);
    });
  });
});
