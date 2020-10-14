import './syntax/jsx-import/JSX-import-JSX';

export { testNullishCoalescing } from './syntax/nullish-coalescing';
export { testOptionalChaining } from './syntax/optional-chaining';

export { testGenerator } from './syntax/generator';
export { testAsync } from './syntax/async';

export { kebabCase } from 'lodash';
export { merge, mergeAll } from 'lodash/fp';

export { returnsTrue } from './returnsTrue';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('dev only output');
  }
  return a + b;
};
