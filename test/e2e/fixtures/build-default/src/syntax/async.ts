// regression test for async/await
// code inspired by https://github.com/formium/tsdx/issues/869
(async () => {
  await Promise.resolve();
  console.log('a side effect to make sure this is output');
})();
