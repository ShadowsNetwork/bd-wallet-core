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
  protected purpose: number;
  private rootKey: any;

  constructor(str: WordsAmount | string = 12) {
    this.wordlist = wordlists.english;
    this.purpose = 44;

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

  protected cacheRootKey<T>(setKey: () => T): T {
    return this.rootKey || (this.rootKey = setKey(), this.rootKey);
  }

  protected abstract getId(): number;
}
