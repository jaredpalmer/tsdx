// regression test for nullish coalescing syntax
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing

export function testNullishCoalescing() {
  const someFunc = () => 'some string';
  const someFalse = false;
  const shouldBeTrue = !(someFalse ?? someFunc());
  return shouldBeTrue;
}
