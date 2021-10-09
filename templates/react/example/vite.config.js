import { defineConfig } from 'vite';
import ReactPlugin from 'vite-preset-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ReactPlugin({
      injectReact: false,
    }),
  ],
});
