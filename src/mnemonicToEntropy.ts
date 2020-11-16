import { binaryToByte } from './libs/binaryToByte';
import { deriveChecksumBits } from './libs/deriveChecksumBits';
import { leftPad } from './libs/leftPad';
import { normalize } from './libs/normalize';
import { validateEntropy } from './libs/validateEntropy';
import wordlist from './libs/wordList.json';

export const mnemonicToEntropy = (mnemonic: string): string => {
  const words = normalize(mnemonic).split(' ');

  if (words.length % 3 !== 0) {
      throw new Error('Invalid mnemonic');
  }

  // convert word indices to 11 bit binary strings
  const bits = words
    .map((word) => {
      const index = wordlist.indexOf(word);

      if (!~index) {
          throw new Error('Invalid mnemonic');
      }

      return leftPad(index.toString(2), '0', 11);
    })
    .join('');

  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);
  // calculate the checksum and compare
  const entropyBytes = entropyBits.match(/(.{1,8})/g)!.map(binaryToByte);

  validateEntropy(entropyBytes);

  const entropy = Buffer.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);

  if (newChecksum !== checksumBits) {
      throw new Error('Invalid mnemonic checksum');
  }

  return entropy.toString('hex');
}
