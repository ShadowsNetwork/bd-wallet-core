import { DotWallet } from '../src';
import { WordsAmount } from '../src/wallets/Wallet';

export class DotTestWallet extends DotWallet {
  constructor(str: WordsAmount | string = 12) {
    super(str, 'wss://westend-rpc.polkadot.io');
  }
}
