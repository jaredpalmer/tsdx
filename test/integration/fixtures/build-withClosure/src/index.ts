const split = (str: string) => str.split('');

const sum = (a: number, b: number) => {
  return a + b;
};

const bar = split('bar');

// this line gets minified differently with
// Terser vs. Closure vs. Closure ADVANCED_OPTIMIZATIONS
export const signature = `${split('bar').join('')} ${sum(bar.length, -3)}`;
