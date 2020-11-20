import Keyring from '@polkadot/keyring';
import { Wallet } from './Wallet';

const keyring = new Keyring({ type: 'sr25519' });

export class DotWallet extends Wallet {
  getAddress(...indexes: number[]) {
    if (!indexes.length) {
      return this.getRoot().address;
    }

    return this.getRoot().derive(this.getDerivePath(indexes)).address;
  }

  getRoot() {
    return this.cacheRootKey(() => keyring.createFromUri(this.mnemonic));
  }

  protected getDerivePath(indexes: number[]): string {
    return indexes.reduce((carry, account) => carry + `//${account}`, '');
  }

  protected getId(): number {
    return 354;
  }
}
