import invariant from 'tiny-invariant';
import warning from 'tiny-warning';

invariant(true, 'error occurred! o no');
warning(true, 'warning - water is wet');

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('dev only output');
  }
  return a + b;
};
