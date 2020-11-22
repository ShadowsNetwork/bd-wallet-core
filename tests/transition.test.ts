import { expect } from 'chai';
import { RegTestWallet } from '../src/wallets/RegTestWallet';

it ('create an transition for bip44', async () => {
  const wallet = new RegTestWallet(12, false);
  const meta = wallet.getAddress();

  let unspents = await wallet.getUnspents(meta.address);
  expect(unspents).to.have.length(0);

  const unspent = await wallet.applyMoney(meta.address, 10000);
  expect(unspent.value === 10000);

  unspents = (await wallet.getUnspents(meta.address)).sort((a, b) => b.value - a.value);
  expect(unspents).to.have.length(1);
  expect(JSON.stringify(unspents[0])).to.equal(JSON.stringify(unspent));

  const toAddress = 'n2Ctbobmzo5o8JZYg38rKK7Pg6KAoS8EaE';
  const outputMoney = 500;
  let fee = await wallet.calcuteFee(unspents, meta.privateKey, meta.address, toAddress, 10000, 0);
  expect(fee).to.equal(-1);

  fee = await wallet.calcuteFee(unspents, meta.privateKey, meta.address, toAddress, outputMoney, 0);
  await wallet.send(meta.privateKey, meta.address, toAddress, outputMoney);
  unspents = await wallet.getUnspents(meta.address);
  const change = 10000 - outputMoney - fee;

  expect(unspents).to.have.length(1);
  expect(unspents[0].value).to.equal(change);
});

it ('create an transition for bip44 with multi inputs', async () => {
  const wallet = new RegTestWallet(15, false);
  const meta = wallet.getAddress();

  await wallet.applyMoney(meta.address, 2000);
  await wallet.applyMoney(meta.address, 2000);
  await wallet.applyMoney(meta.address, 1000);

  const toAddress = 'n2Ctbobmzo5o8JZYg38rKK7Pg6KAoS8EaE';
  const outputMoney = 2100;
  let unspents = (await wallet.getUnspents(meta.address)).sort((a, b) => b.value - a.value);

  expect(unspents).to.have.length(3);

  const fee = await wallet.calcuteFee(unspents, meta.privateKey, meta.address, toAddress, outputMoney, 0);
  const change = 2000 + 2000 - outputMoney - fee;

  await wallet.send(meta.privateKey, meta.address, toAddress, outputMoney);
  unspents = await wallet.getUnspents(meta.address);

  expect(unspents).to.have.length(2);
  expect(unspents[1].value).to.equal(change);
});
