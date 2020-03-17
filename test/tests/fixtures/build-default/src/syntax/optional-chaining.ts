// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining

export const foo = (foo?: { bar: string }) => foo?.bar || 'bar';
