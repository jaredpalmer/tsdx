import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
invariant(true, 'error occurred! o no');
warning(false, 'warning - water is wet');
export { foo } from './foo';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('fuck');
  }
  return a + b;
};
