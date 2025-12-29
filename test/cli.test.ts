import { describe, it, expect } from 'bun:test';
import { execSync } from 'child_process';
import path from 'path';

const CLI_PATH = path.resolve(__dirname, '../dist/index.js');

describe('tsdx CLI', () => {
  it('should display help', () => {
    const output = execSync(`node ${CLI_PATH} --help`, { encoding: 'utf-8' });
    expect(output).toContain('Zero-config TypeScript package development');
  });

  it('should display version', () => {
    const output = execSync(`node ${CLI_PATH} --version`, { encoding: 'utf-8' });
    expect(output).toMatch(/\d+\.\d+\.\d+/);
  });

  it('should list commands', () => {
    const output = execSync(`node ${CLI_PATH} --help`, { encoding: 'utf-8' });
    expect(output).toContain('create');
    expect(output).toContain('build');
    expect(output).toContain('dev');
    expect(output).toContain('init');
  });
});
