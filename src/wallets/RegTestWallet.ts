import { networks } from 'bitcoinjs-lib';
import { RegtestUtils } from 'regtest-client';
import { BtcWallet, Output } from './BtcWallet';
import { WordsAmount } from './Wallet';

export class RegTestWallet extends BtcWallet {
  protected readonly regtestUtils: RegtestUtils;

  constructor(str: WordsAmount | string = 12, isBip49: boolean = true) {
    super(str, isBip49);
    this.network = networks.regtest;
    this.regtestUtils = new RegtestUtils({
      APIURL: 'http://127.0.0.1:8080/1',
    });
  }

  async applyMoney(address: string, money: number) {
    return this.regtestUtils.faucet(address, money);
  }

  verify(txId: string, outputs: Output[]) {
    return Promise.all(outputs.map((output) => {
      return this.regtestUtils.verify({
        address: output.address,
        txId: txId,
        value: output.value,
        vout: 0,
      });
    }));
  }

  getUnspents(address: string) {
    return this.regtestUtils.unspents(address);
  }

  protected getUtxo(txId: string) {
    return this.regtestUtils.fetch(txId);
  }

  protected broadcast(txHex: string) {
    return this.regtestUtils.broadcast(txHex);
  }

  protected async getFeeRate() {
    return Promise.resolve().then(() => 1);
  }

  protected getId() {
    return 1;
  }
}
