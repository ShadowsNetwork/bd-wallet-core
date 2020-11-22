import { provider } from 'web3-core';
import { EthWallet } from '../src';
import { WordsAmount } from '../src/wallets/Wallet';

export class EthTestWallet extends EthWallet {
  constructor(str: WordsAmount | string = 12, provider: provider) {
    super(str, provider);
    this.transactionConfig.chain = 'rinkeby';
  }
}
