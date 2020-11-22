import { fromSeed } from 'bip32';
import { addHexPrefix, intToHex, publicToAddress, toChecksumAddress } from 'ethereumjs-util';
import Web3 from 'web3';
import { provider, TransactionConfig } from 'web3-core';
import { Wallet, WordsAmount } from './Wallet';

export interface EthAddressMeta {
  address: string;
  publicKey: string;
  privateKey: string;
}

export class EthWallet extends Wallet {
  protected readonly web3: Web3;
  protected transactionConfig: Partial<TransactionConfig> = {};

  constructor(str: WordsAmount | string = 12, provider: provider) {
    super(str);
    this.web3 = new Web3(provider);
    this.transactionConfig = {
      chain: 'mainnet',
      hardfork: 'petersburg',
    };
  }

  getAddress(account: number = 0, index: number = 0, internal: boolean = false): EthAddressMeta {
    const derivePath = this.getDerivePath(account, index, internal);
    const child = this.getRoot().derivePath(derivePath);
    const address = publicToAddress(child.publicKey, true).toString('hex');

    return {
      address: toChecksumAddress(addHexPrefix(address)),
      get privateKey() {
        return addHexPrefix(child.privateKey!.toString('hex'));
      },
      get publicKey() {
        return addHexPrefix(child.publicKey.toString('hex'));
      }
    };
  }

  async send(privateKey: string, toAddress: string, outputMoney: number, gas: number = 21000, gasPrice?: number) {
    const tx = await this.web3.eth.accounts.signTransaction({
      ...this.transactionConfig,
      gas: intToHex(gas),
      gasPrice: intToHex(gasPrice || Number(await this.web3.eth.getGasPrice())),
      to: toAddress,
      value: intToHex(outputMoney),
    }, privateKey);

    return this.web3.eth.sendSignedTransaction(tx.rawTransaction!);
  }

  getWeb3() {
    return this.web3;
  }

  getRoot() {
    return this.cacheRootKey(() => fromSeed(this.seed));
  }

  protected getDerivePath(account: number, index: number, internal: boolean): string {
    return `m/${this.purpose}'/${this.getId()}'/${account}'/${internal ? 1 : 0}/${index}`;
  }

  protected getId(): number {
    return 60;
  }
}
