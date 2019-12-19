// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing

const bar = () => {};
const foo = false;
export const x = foo ?? bar();
