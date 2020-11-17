import { generateMnemonic, mnemonicToSeedSync, wordlists, validateMnemonic, mnemonicToEntropy } from 'bip39';

export class Wallet {
  protected readonly seed: Buffer;
  protected readonly wordlist: string[];
  protected readonly mnemonic: string;
  protected readonly password?: string;

  constructor(strLength?: number, password?: string);
  constructor(mnemonic: string, password?: string);
  constructor(str?: number | string, password?: string) {
    this.wordlist = wordlists.english;

    if (str === undefined) {
      str = 128;
    }

    if (typeof str === 'number') {
      this.mnemonic = generateMnemonic(str, undefined, this.wordlist);
    } else {
      if (!validateMnemonic(str, this.wordlist)) {
        throw new Error('Mnemonic is invalid');
      }
      this.mnemonic = str;
    }

    this.seed = mnemonicToSeedSync(this.mnemonic);
    this.password = password;
  }

  getEntropy(): string {
    return mnemonicToEntropy(this.mnemonic);
  }

  getMnemonic(): string {
    return this.mnemonic;
  }
}
