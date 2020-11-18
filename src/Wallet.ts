import { generateMnemonic, mnemonicToSeedSync, wordlists, validateMnemonic, mnemonicToEntropy } from 'bip39';
import { bip32, payments } from 'bitcoinjs-lib';
import { publicToAddress, addHexPrefix } from 'ethereumjs-util';
import { COIN, COIN_META } from './libs/coin';
import { Keyring } from '@polkadot/keyring';

export class Wallet {
  protected readonly seed: Buffer;
  protected readonly wordlist: string[];
  protected readonly mnemonic: string;
  protected readonly password?: string;
  protected readonly purpose: number;

  constructor(strLength?: number, password?: string);
  constructor(mnemonic: string, password?: string);
  constructor(str?: number | string, password?: string) {
    this.wordlist = wordlists.english;
    this.password = password;
    this.purpose = 44;

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
  }

  getEntropy(): string {
    return mnemonicToEntropy(this.mnemonic);
  }

  getMnemonic(): string {
    return this.mnemonic;
  }

  getAddress(coin: COIN, account: number = 0, index: number = 0, internal: boolean = false) {
    const child = this
      .getRoot(coin)
      .derivePath(`m/${this.purpose}'/${COIN_META[coin].id}'/${account}'/${internal ? 1 : 0}/${index}`);


    switch (coin) {
      case 'BTC':
        return payments.p2pkh({ pubkey: child.publicKey }).address;
      case 'ETH':
        return addHexPrefix(publicToAddress(child.publicKey, true).toString('hex'));
      case 'DOT':
        const keyring: Keyring = new Keyring();
        const pair = keyring.createFromUri(this.getMnemonic());
        keyring.setSS58Format(0);
        return pair.address;
    }
  }

  protected getRoot(coin: COIN) {
    return bip32.fromSeed(this.seed, COIN_META[coin].network);
  }
}
