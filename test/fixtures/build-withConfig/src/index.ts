import { split } from './foo';

export const sum = (a: number, b: number) => {
  return a + b;
};

const bar = split('bar');

console.log(`${split('bar').join('')} ${sum(bar.length, -3)}`);
