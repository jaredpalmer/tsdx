const { safePackageName } = require('../../src/utils');

describe('utils | safePackageName', () => {
  it('should generate safe package name', () => {
    expect(safePackageName('@babel/core')).toBe('core');
    expect(safePackageName('react')).toBe('react');
    expect(safePackageName('react-dom')).toBe('react-dom');
  });
});
