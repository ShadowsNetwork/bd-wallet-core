import { generateMnemonic, mnemonicToSeedSync, wordlists, validateMnemonic, mnemonicToEntropy } from 'bip39';

const STRENGTH_MAP = {
  12: 16 * 8,
  15: 20 * 8,
  18: 24 * 8,
  21: 28 * 8,
  24: 32 * 8
};

export type WordsAmount = keyof typeof STRENGTH_MAP;

export abstract class Wallet {
  protected readonly seed: Buffer;
  protected readonly wordlist: string[];
  protected readonly mnemonic: string;
  protected readonly purpose: number;

  constructor(wordsAmount?: WordsAmount, isBip49?: boolean);
  constructor(mnemonic: string, isBip49?: boolean);
  constructor(str: WordsAmount | string = 12, isBip49: boolean = true) {
    this.wordlist = wordlists.english;
    this.purpose = isBip49 ? 49 : 44;

    if (typeof str === 'number') {
      this.mnemonic = generateMnemonic(STRENGTH_MAP[str], undefined, this.wordlist);
    } else {
      if (!validateMnemonic(str, this.wordlist)) {
        throw new Error('Mnemonic is invalid');
      }
      this.mnemonic = str;
    }

    this.seed = mnemonicToSeedSync(this.mnemonic);
  }

  getEntropy(): string {
    return mnemonicToEntropy(this.mnemonic);
  }

  getSeed(): Buffer {
    return this.seed;
  }

  getMnemonic(): string {
    return this.mnemonic;
  }

  protected abstract getId(): number;
}
