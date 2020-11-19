import { generateMnemonic, mnemonicToSeedSync, wordlists, validateMnemonic, mnemonicToEntropy } from 'bip39';

const STRENGTH_MAP = {
  12: 16 * 8,
  15: 20 * 8,
  18: 24 * 8,
  21: 28 * 8,
  24: 32 * 8
};

export abstract class Wallet {
  protected readonly seed: Buffer;
  protected readonly wordlist: string[];
  protected readonly mnemonic: string;
  protected readonly password?: string;
  protected readonly purpose: number;

  constructor(wordsAmount?: keyof typeof STRENGTH_MAP, password?: string);
  constructor(mnemonic: string, password?: string);
  constructor(str: keyof typeof STRENGTH_MAP | string = 12, password?: string) {
    this.wordlist = wordlists.english;
    this.password = password;
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

  getMnemonic(): string {
    return this.mnemonic;
  }

  protected abstract getId(): number;
}
