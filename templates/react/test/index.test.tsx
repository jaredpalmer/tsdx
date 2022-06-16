import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Thing } from '../src';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div!);
    root.render(<Thing />);
    root.unmount(div);
  });
});
