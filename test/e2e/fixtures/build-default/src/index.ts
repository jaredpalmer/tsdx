import './syntax/nullish-coalescing';
import './syntax/optional-chaining';

import './syntax/jsx-import/JSX-import-JSX';

import './syntax/async';
export { testGenerator } from './syntax/generator';

export { kebabCase } from 'lodash';
export { merge, mergeAll } from 'lodash/fp';

export { returnsTrue } from './returnsTrue';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('dev only output');
  }
  return a + b;
};
