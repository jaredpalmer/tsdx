import { describe, it, expect } from 'vitest';
import { sum } from '../src';

describe('sum', () => {
  it('adds two numbers together', () => {
    expect(sum(1, 1)).toBe(2);
  });

  it('handles negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });

  it('handles zero', () => {
    expect(sum(0, 0)).toBe(0);
  });
});
