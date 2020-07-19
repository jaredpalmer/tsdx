import './node_modules/react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from './node_modules/react-dom';
import { Thing } from '../.';

const App = () => {
  return (
    <div>
      <Thing />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
