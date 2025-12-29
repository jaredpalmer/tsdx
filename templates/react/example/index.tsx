import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Thing } from '../src';

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Component Demo</h1>
      <Thing />
      <Thing>Custom content!</Thing>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
