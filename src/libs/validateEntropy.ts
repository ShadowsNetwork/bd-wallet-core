export const validateEntropy = (entropy: Buffer | number[]) => {
  if (entropy.length < 16 || entropy.length > 32 || entropy.length % 4 !== 0) {
    throw new TypeError('Invalid entropy');
  }
};
