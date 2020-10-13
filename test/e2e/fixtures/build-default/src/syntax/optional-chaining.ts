// regression test for optional chaining syntax
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining

const someObj: { someOptionalString?: string } = {};
const shouldBeBar = someObj?.someOptionalString || 'bar';
