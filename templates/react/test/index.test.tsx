import { describe, it, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Thing } from '../src';

describe('Thing', () => {
  it('renders without crashing', () => {
    render(<Thing />);
    expect(screen.getByText(/snozzberries/)).toBeDefined();
  });

  it('renders children when provided', () => {
    render(<Thing>Hello World</Thing>);
    expect(screen.getByText('Hello World')).toBeDefined();
  });
});
