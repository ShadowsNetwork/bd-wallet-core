import { expect } from 'chai';
import { BtcWallet } from '../src';

it ('can generate mnemonic', () => {
  const wallet = new BtcWallet(12);
  expect(wallet.getMnemonic().split(' ')).to.have.length(12);

  const wallet1 = new BtcWallet(15);
  expect(wallet1.getMnemonic().split(' ')).to.have.length(15);

  const wallet2 = new BtcWallet('guitar tumble defy clever wall raw food exact tenant page collect clarify tone dwarf supreme');
  expect(wallet2.getMnemonic()).to.equal('guitar tumble defy clever wall raw food exact tenant page collect clarify tone dwarf supreme');
});
