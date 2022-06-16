import React from 'react';
import { createRoot, unmountComponentAtNode } from 'react-dom/client';
import { Default as Thing } from '../stories/Thing.stories';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div!);
    root.render(<Thing />);
    root.unmount(div);
  });
});
