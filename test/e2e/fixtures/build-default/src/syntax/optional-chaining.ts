// regression test for optional chaining syntax
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining

export function testOptionalChaining() {
  const someObj: { someOptionalString?: string } = {};
  const shouldBeTrue = someObj?.someOptionalString || true;
  return shouldBeTrue;
}
