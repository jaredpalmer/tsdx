function ReactError(message) {
  const error = new Error(message);
  error.name = 'Invariant Violation';
  return error;
}

export default ReactError;
