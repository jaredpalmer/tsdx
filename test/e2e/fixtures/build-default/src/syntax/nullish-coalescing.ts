// regression test for nullish coalescing syntax
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing

const someFunc = () => {};
const someFalse = false;
const shouldBeFalse = someFalse ?? someFunc();
