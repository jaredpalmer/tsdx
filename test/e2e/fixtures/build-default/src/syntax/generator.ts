// regression test for generators
export function* testGenerator(): IterableIterator<boolean> {
  return yield true;
}
