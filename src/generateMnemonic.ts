import randomByte from 'randombytes';
import wordlist from './libs/wordList.json';
import { bytesToBinary } from './libs/byteToBinary';
import { binaryToByte } from './libs/binaryToByte';
import { deriveChecksumBits } from './libs/deriveChecksumBits';
import { validateEntropy } from './libs/validateEntropy';

export const generateMnemonic = (strLength: number = 128): string => {
  if (strLength % 32 !== 0) {
    throw new TypeError('Invalid length');
  }

  const entropy = randomByte(strLength / 8);

  validateEntropy(entropy);


  const entropyBits = bytesToBinary(Array.from(entropy));
  const checksumBits = deriveChecksumBits(entropy);
  const bits = entropyBits + checksumBits;
  const chunks: string[] = bits.match(/(.{1,11})/g)!;
  const words = chunks.map((binary) => {
      const index = binaryToByte(binary);
      return wordlist[index];
  });

  return words.join(' ');
};
