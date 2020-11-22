import { bip32, Network, networks, payments } from 'bitcoinjs-lib';
import axios from 'axios';
import { Wallet, WordsAmount } from './Wallet';

export interface Unspent {
  value: number;
  txId: string;
  vout: number;
  address?: string;
  height?: number;
}

export interface Output {
  address: string;
  value: number;
};

export interface AddressMeta {
  payment: payments.Payment;
  address: string;
  publicKey: string;
  privateKey: string;
}

export const BIP_49 = 49;

export class BtcWallet extends Wallet {
  protected network: Network;

  constructor(str: WordsAmount | string = 12, isBip49: boolean = true) {
    super(str);
    this.network = networks.bitcoin;
    isBip49 && (this.purpose = BIP_49);
  }

  getAddress(account: number = 0, index: number = 0, internal: boolean = false): AddressMeta {
    const derivePath = this.getDerivePath(account, index, internal);
    const child = this.getRoot().derivePath(derivePath);

    const payment = this.purpose === BIP_49
      ? payments.p2sh({ redeem: payments.p2wpkh({ pubkey: child.publicKey, network: this.network }) })
      : payments.p2pkh({ pubkey: child.publicKey, network: this.network });

    return {
      payment,
      address: payment.address!,
      get privateKey() {
        return child.toWIF();
      },
      get publicKey() {
        return payment.pubkey!.toString('hex');
      }
    };
  }

  getRoot() {
    return this.cacheRootKey(() => bip32.fromSeed(this.seed, this.network));
  }

  protected async getFeeRate() {
    type Response = { limits: { min: number; max: number }; regular: number; priority: number };
    const response = await axios.get<Response>('https://api.blockchain.info/mempool/fees');

    return response.data.regular;
  }

  protected getDerivePath(account: number, index: number, internal: boolean): string {
    return `m/${this.purpose}'/${this.getId()}'/${account}'/${internal ? 1 : 0}/${index}`;
  }

  protected getId(): number {
    return 0;
  }
}
