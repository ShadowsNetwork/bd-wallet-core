import { expect } from 'chai';
import { BtcTestWallet } from './BtcTestWallet';
import { EthTestWallet } from './EthTestWallet';

it ('create an btc transition for bip44', async () => {
  const wallet = new BtcTestWallet(12, false);
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
  let fee = await wallet.calcuteFee(unspents, meta, toAddress, 10000, 2, 0);
  expect(fee).to.equal(-1);

  fee = await wallet.calcuteFee(unspents, meta, toAddress, outputMoney, 2, 0);
  await wallet.send(meta, toAddress, outputMoney, 2);
  unspents = await wallet.getUnspents(meta.address);
  const change = 10000 - outputMoney - fee;

  expect(unspents).to.have.length(1);
  expect(unspents[0].value).to.equal(change);
});

it ('create an btc transition for bip44 with multi inputs', async () => {
  const wallet = new BtcTestWallet(15, false);
  const meta = wallet.getAddress();

  await wallet.applyMoney(meta.address, 2000);
  await wallet.applyMoney(meta.address, 2000);
  await wallet.applyMoney(meta.address, 1000);

  const toAddress = 'n2Ctbobmzo5o8JZYg38rKK7Pg6KAoS8EaE';
  const outputMoney = 2100;
  let unspents = (await wallet.getUnspents(meta.address)).sort((a, b) => b.value - a.value);

  expect(unspents).to.have.length(3);

  const fee = await wallet.calcuteFee(unspents, meta, toAddress, outputMoney, 2, 0);
  const change = 2000 + 2000 - outputMoney - fee;

  await wallet.send(meta, toAddress, outputMoney, 2);
  unspents = await wallet.getUnspents(meta.address);

  expect(unspents).to.have.length(2);
  expect(unspents[1].value).to.equal(change);
});

it ('create an btc transition for bip49', async () => {
  const wallet = new BtcTestWallet(15, true);
  const meta = wallet.getAddress();

  let unspents = await wallet.getUnspents(meta.address);
  expect(unspents).to.have.length(0);

  const unspent = await wallet.applyMoney(meta.address, 10000);
  expect(unspent.value === 10000);

  unspents = (await wallet.getUnspents(meta.address)).sort((a, b) => b.value - a.value);
  expect(unspents).to.have.length(1);
  expect(JSON.stringify(unspents[0])).to.equal(JSON.stringify(unspent));

  const toAddress = '2MzS5eYFvsvsNSSsUZjmvuHkxqawZW8sPd5';
  const outputMoney = 3000;
  let fee = await wallet.calcuteFee(unspents, meta, toAddress, 10000, 2, 0);
  expect(fee).to.equal(-1);

  fee = await wallet.calcuteFee(unspents, meta, toAddress, outputMoney, 2, 0);
  await wallet.send(meta, toAddress, outputMoney, 2);
  unspents = await wallet.getUnspents(meta.address);
  const change = 10000 - outputMoney - fee;

  expect(unspents).to.have.length(1);
  expect(unspents[0].value).to.equal(change);
});

it ('create eth transaction', async () => {
  const wallet = new EthTestWallet(
    'vague zone verb adjust hamster often mirror come explain entry truck zero torch luxury fashion',
    'https://rinkeby.infura.io/v3/56b8a1113e87427185552ad5e9c54285'
  );
  const meta = wallet.getAddress(0, 1);
  const targetAddress = wallet.getAddress(0, 2).address;
  const balance = await wallet.getWeb3().eth.getBalance(targetAddress);

  await wallet.send(meta.privateKey, targetAddress, 2);
  const newBalance = await wallet.getWeb3().eth.getBalance(targetAddress);

  expect(Number(newBalance) - Number(balance)).to.equal(2);

  await wallet.send(meta.privateKey, targetAddress, 3);
  const latestBalance = await wallet.getWeb3().eth.getBalance(targetAddress);
  expect(Number(latestBalance) - Number(balance)).to.equal(5);
});
