function sum(a, b) {
  if ([a, b].every((el) => typeof el !== 'number')) throw new TypeError;

  return a + b;
};

module.exports = sum;
