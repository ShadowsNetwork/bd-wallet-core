import { fromSeed } from 'bip32';
import { addHexPrefix, intToHex, publicToAddress, stripHexPrefix, toChecksumAddress } from 'ethereumjs-util';
import Web3 from 'web3';
import { provider, TransactionConfig } from 'web3-core';
import { Wallet, WordsAmount } from './Wallet';

export interface EthAccount {
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

  getAccount(account: number = 0, index: number = 0, internal: boolean = false): EthAccount {
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

  async send(account: EthAccount, toAddress: string, outputMoney: number, gas: number) {
    const tx = await this.web3.eth.accounts.signTransaction({
      ...this.transactionConfig,
      gas: intToHex(gas),
      to: toAddress,
      value: intToHex(outputMoney),
    }, account.privateKey);

    return this.web3.eth.sendSignedTransaction(tx.rawTransaction!);
  }

  /**
   * The contract is based on erc20 standard
   */
  async sendContract(account: EthAccount, toAddress: string, contractAddress: string, outputMoney: number, gas: number) {
    const { padLeft } = this.web3.utils;
    const functionId = this.web3.eth.abi.encodeFunctionSignature('transfer(address,uint256)');

    const tx = await this.web3.eth.accounts.signTransaction({
      ...this.transactionConfig,
      gas: intToHex(gas),
      to: contractAddress,
      value: intToHex(0),
      data:
        functionId +
        padLeft(stripHexPrefix(toAddress), 64) +
        padLeft(stripHexPrefix(intToHex(outputMoney)), 64),
    }, account.privateKey);

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
