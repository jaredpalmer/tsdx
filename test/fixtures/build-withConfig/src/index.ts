import { split } from './foo';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('fuck');
  }
  return a + b;
};

const bar = split('bar');

export const signature = `${split('bar').join('')} ${sum(bar.length, -3)}`;
