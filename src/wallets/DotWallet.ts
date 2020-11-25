import { Wallet, WordsAmount } from './Wallet';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { waitReady } from '@polkadot/wasm-crypto';

const keyring = new Keyring({ type: 'sr25519' });

export class DotWallet extends Wallet {
  protected provider: string;
  protected api?: ApiPromise;

  constructor(str: WordsAmount | string = 12, wsProvider: string = 'wss://rpc.polkadot.io') {
    super(str);
    this.provider = wsProvider;
  }

  waitReady() {
    return waitReady();
  }

  getAddress(...indexes: number[]) {
    if (!indexes.length) {
      return this.getRoot();
    }

    return this.getRoot().derive(this.getDerivePath(indexes));
  }

  getRoot() {
    return this.cacheRootKey(() => keyring.addFromUri(this.mnemonic));
  }

  async getApi() {
    if (!this.api) {
      await this.waitReady();
      this.api = await ApiPromise.create({
        provider: new WsProvider(this.provider),
      });
      await this.api.isReady;
    }

    return this.api;
  }

  async send(pair: KeyringPair, toAddress: string, outputMoney: number) {
    const api = await this.getApi();
    const data = await api.tx.balances.transfer(toAddress, outputMoney).signAndSend(pair);

    return data;
  }

  async disconnect() {
    await this.api?.disconnect();
    this.api = undefined;
  }

  protected getDerivePath(indexes: number[]): string {
    return indexes.reduce((carry, account) => carry + `//${account}`, '');
  }

  protected getId(): number {
    return 354;
  }
}
