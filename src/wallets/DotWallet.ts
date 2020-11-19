import Keyring from '@polkadot/keyring';
import { Wallet } from './Wallet';

const keyring = new Keyring({ type: 'sr25519' });

export class DotWallet extends Wallet {
  getAddress(...indexes: number[]) {
    return this.getRootKey().derive(this.getDerivePath(indexes)).address;
  }

  getRootKey() {
    return this.cacheRootKey(() => keyring.createFromUri(this.mnemonic));
  }

  protected getDerivePath(indexes: number[]): string {
    !indexes.length && indexes.push(0);
    return indexes.reduce((carry, account) => carry + `//${account}`, '');
  }

  protected getId(): number {
    return 354;
  }
}
