import { generateMnemonic, mnemonicToSeedSync, wordlists, validateMnemonic, mnemonicToEntropy } from 'bip39';

export abstract class Wallet {
  protected readonly seed: Buffer;
  protected readonly wordlist: string[];
  protected readonly mnemonic: string;
  protected readonly password?: string;
  protected readonly purpose: number;

  constructor(strLength?: number, password?: string);
  constructor(mnemonic: string, password?: string);
  constructor(str: number | string = 128, password?: string) {
    this.wordlist = wordlists.english;
    this.password = password;
    this.purpose = 44;

    if (typeof str === 'number') {
      this.mnemonic = generateMnemonic(str, undefined, this.wordlist);
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
