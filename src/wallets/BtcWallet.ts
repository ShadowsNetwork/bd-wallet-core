import { bip32, payments } from 'bitcoinjs-lib';
import { Wallet } from './Wallet';

export class BtcWallet extends Wallet {
  getAddress(account: number = 0, index: number = 0, internal: boolean = false) {
    const derivePath = this.getDerivePath(account, index, internal);
    const child = this.getRoot().derivePath(derivePath);

    if (this.purpose === 49) {
      return payments.p2sh({ redeem: payments.p2wpkh({ pubkey: child.publicKey }) }).address;
    }

    return payments.p2pkh({ pubkey: child.publicKey }).address;
  }

  getRoot() {
    return bip32.fromSeed(this.seed);
  }

  protected getDerivePath(account: number, index: number, internal: boolean): string {
    return `m/${this.purpose}'/${this.getId()}'/${account}'/${internal ? 1 : 0}/${index}`;
  }

  protected getId(): number {
    return 0;
  }
}
