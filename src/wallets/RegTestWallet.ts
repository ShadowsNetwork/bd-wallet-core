import { ECPair, networks, Psbt } from 'bitcoinjs-lib';
import { RegtestUtils } from 'regtest-client';
import { AddressMeta, BIP_49, BtcWallet, Output, Unspent } from './BtcWallet';
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

  async send(meta: AddressMeta, toAddress: string, outputMoney: number) {
    const unspents = (await this.getUnspents(meta.address)).sort((a, b) => b.value - a.value);
    let fee = await this.calcuteFee(unspents, meta, toAddress, outputMoney, 0);
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

    await this.broadcase(tx.toHex());
    await this.verify(tx.getId(), outputs.slice(0, -1));
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

  async calcuteFee(unspents: Unspent[], meta: AddressMeta, toAddress: string, outputMoney: number, expectedFee: number = 0) {
    const feeRate = await this.getFeeRate();
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
      fee = await this.calcuteFee(unspents, meta, toAddress, outputMoney, fee);
      if (totalMoney - outputMoney - fee < 0) {
        return -1;
      }
    }

    return fee;
  }

  getUnspents(address: string) {
    return this.regtestUtils.unspents(address);
  }

  protected getUtxo(txId: string) {
    return this.regtestUtils.fetch(txId);
  }

  protected broadcase(txHex: string) {
    return this.regtestUtils.broadcast(txHex);
  }

  protected async getFeeRate() {
    return Promise.resolve().then(() => 1);
  }

  protected getId() {
    return 1;
  }
}
