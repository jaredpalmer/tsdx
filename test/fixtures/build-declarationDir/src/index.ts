import './syntax/nullish-coalescing';
import './syntax/optional-chaining';

export { foo } from './foo';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('fuck');
  }
  return a + b;
};
