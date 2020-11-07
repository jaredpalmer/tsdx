import React from 'react';
import * as ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Thing } from '../stories/Thing.stories';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Thing />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  // Test example using react-testing-library
  it('renders the correct text', () => {
    const { getByText } = render(<Thing />);

    expect(
      getByText('the snozzberries taste like snozzberries')
    ).toBeInTheDocument();
  });
});
