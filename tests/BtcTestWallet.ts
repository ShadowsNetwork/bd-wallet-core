import { networks } from 'bitcoinjs-lib';
import { RegtestUtils } from 'regtest-client';
import { BtcWallet, Output, Unspent, UTXO } from '../src/wallets/BtcWallet';
import { WordsAmount } from '../src/wallets/Wallet';

export class BtcTestWallet extends BtcWallet {
  protected readonly regtestUtils: RegtestUtils;

  constructor(str: WordsAmount | string = 12, isBip49: boolean = true) {
    super(str, isBip49);
    this.network = networks.regtest;
    this.regtestUtils = new RegtestUtils({
      APIURL: 'http://127.0.0.1:8080/1',
    });
  }

  async applyMoney(address: string, money: number): Promise<Unspent> {
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

  getUnspents(address: string): Promise<Unspent[]> {
    return this.regtestUtils.unspents(address);
  }

  protected getUtxo(txId: string): Promise<UTXO> {
    return this.regtestUtils.fetch(txId);
  }

  protected broadcast(txHex: string) {
    return this.regtestUtils.broadcast(txHex);
  }

  protected getId() {
    return 1;
  }
}
