import { bip32 } from 'bitcoinjs-lib';
import { addHexPrefix, publicToAddress } from 'ethereumjs-util';
import { Wallet } from './Wallet';

export class EthWallet extends Wallet {
  getAddress(account: number = 0, index: number = 0, internal: boolean = false) {
    const derivePath = this.getDerivePath(account, index, internal);
    const child = this.getRoot().derivePath(derivePath);

    return addHexPrefix(publicToAddress(child.publicKey, true).toString('hex'));
  }

  getRoot() {
    return bip32.fromSeed(this.seed);
  }

  protected getDerivePath(account: number, index: number, internal: boolean): string {
    return `m/${this.purpose}'/${this.getId()}'/${account}'/${internal ? 1 : 0}/${index}`;
  }

  protected getId(): number {
    return 60;
  }
}
