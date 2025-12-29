import { createPreset } from 'fumadocs-ui/tailwind-plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    './mdx-components.tsx',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  presets: [
    createPreset({
      addGlobalColors: true,
    }),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007ACC',
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#007ACC',
          600: '#0062A3',
          700: '#00497A',
          800: '#003152',
          900: '#001829',
        },
      },
    },
  },
};
