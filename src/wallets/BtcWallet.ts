import { bip32, payments } from 'bitcoinjs-lib';
import { Wallet, WordsAmount } from './Wallet';

const BIP_49 = 49;

export class BtcWallet extends Wallet {
  constructor(str: WordsAmount | string = 12, isBip49: boolean = true) {
    super(str);
    isBip49 && (this.purpose = BIP_49);
  }

  getAddress(account: number = 0, index: number = 0, internal: boolean = false) {
    const derivePath = this.getDerivePath(account, index, internal);
    const child = this.getRoot().derivePath(derivePath);

    if (this.purpose === BIP_49) {
      return payments.p2sh({ redeem: payments.p2wpkh({ pubkey: child.publicKey }) }).address;
    }

    return payments.p2pkh({ pubkey: child.publicKey }).address;
  }

  getRoot() {
    return this.cacheRootKey(() => bip32.fromSeed(this.seed));
  }

  protected getDerivePath(account: number, index: number, internal: boolean): string {
    return `m/${this.purpose}'/${this.getId()}'/${account}'/${internal ? 1 : 0}/${index}`;
  }

  protected getId(): number {
    return 0;
  }
}
