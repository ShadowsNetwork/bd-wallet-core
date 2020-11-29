import { EthWallet } from '../src';
import { WordsAmount } from '../src/wallets/Wallet';

export class EthTestWallet extends EthWallet {
  constructor(str: WordsAmount | string = 12) {
    super(str, 'https://ropsten.infura.io/v3/56b8a1113e87427185552ad5e9c54285');
    this.transactionConfig.chain = 'ropsten';
  }
}
