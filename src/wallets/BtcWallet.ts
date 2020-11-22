import { bip32, ECPair, Network, networks, payments, Psbt } from 'bitcoinjs-lib';
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

export interface UTXO {
  txId: string;
  txHex: string;
  vsize: number;
  version: number;
  locktime: number;
  ins: {
    txId: string;
    vout: number;
    script: string;
    sequence: string;
  }[];
  outs: {
    value: number;
    script: string;
    address?: string;
  }[];
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

  async send(meta: AddressMeta, toAddress: string, outputMoney: number, feeRate: number) {
    const unspents = (await this.getUnspents(meta.address)).sort((a, b) => b.value - a.value);
    let fee = await this.calcuteFee(unspents, meta, toAddress, outputMoney, feeRate, 0);
    const inputs: Unspent[] = [];
    let totalMoney = 0;

    if (fee < 0) {
      throw new Error('Money is not enough');
    }

    for (let i = 0; i < unspents.length; ++i) {
      totalMoney += unspents[i].value;
      inputs.push(unspents[i]);

      if (totalMoney >= outputMoney + fee) {
        break;
      }
    }

    const outputs = [{
      address: toAddress,
      value: outputMoney,
    }];
    let changeMoney = totalMoney - outputMoney - fee;
    changeMoney > 0 && outputs.push({
      address: meta.address,
      value: changeMoney,
    });

    const tx = await this.getTransition(meta, inputs, outputs);

    await this.broadcast(tx.toHex());
    await this.verify(
      tx.getId(),
      changeMoney > 0 ? outputs.slice(0, -1) : outputs
    );
  }

  async calcuteFee(unspents: Unspent[], meta: AddressMeta, toAddress: string, outputMoney: number, feeRate: number, expectedFee: number) {
    const inputs: Unspent[] = [];
    let totalMoney = 0;

    for (let i = 0; i < unspents.length; ++i) {
      totalMoney += unspents[i].value;
      inputs.push(unspents[i]);

      if (totalMoney >= outputMoney + expectedFee) {
        break;
      }
    }

    const outputs = [{
      address: toAddress,
      value: outputMoney,
    }];
    let changeMoney = totalMoney - outputMoney - expectedFee;
    if (changeMoney < 0) {
      return -1;
    }

    changeMoney > 0 && outputs.push({
      address: meta.address,
      value: changeMoney,
    });

    const tx = await this.getTransition(meta, inputs, outputs);
    let fee = (tx.virtualSize() + inputs.length) * feeRate;

    if (totalMoney - outputMoney - fee < 0) {
      fee = await this.calcuteFee(unspents, meta, toAddress, outputMoney, feeRate, fee);
      if (totalMoney - outputMoney - fee < 0) {
        return -1;
      }
    }

    return fee;
  }

  protected async getTransition(meta: AddressMeta, inputs: Unspent[], outputs: Output[]) {
    const pair = ECPair.fromWIF(meta.privateKey, this.network);
    const utxos = await Promise.all(inputs.map((input) => this.getUtxo(input.txId)));

    const psbt = new Psbt({ network: this.network })
      .addInputs(inputs.map((input, index) => {
        const data: Parameters<Psbt['addInputs']>[0][number] = {
          hash: input.txId,
          index: input.vout,
          nonWitnessUtxo: Buffer.from(utxos[index].txHex, 'hex'),
        };

        if (this.purpose === BIP_49) {
          data.redeemScript = meta.payment.redeem?.output;
        }

        return data;
      }))
      .addOutputs(outputs);

    psbt.signAllInputs(pair).validateSignaturesOfAllInputs();
    return psbt.finalizeAllInputs().extractTransaction();
  }

  async getUnspents(_address: string): Promise<Unspent[]> {
    return [];
  }

  protected async getUtxo(_txId: string): Promise<UTXO> {
    return {} as any;
  }

  protected async broadcast(_txId: string): Promise<null> {
    return null;
  }

  protected async verify(_txId: string, _outputs: Output[]): Promise<void[]> {
    return Promise.all([]);
  }

  protected getDerivePath(account: number, index: number, internal: boolean): string {
    return `m/${this.purpose}'/${this.getId()}'/${account}'/${internal ? 1 : 0}/${index}`;
  }

  protected getId(): number {
    return 0;
  }
}
