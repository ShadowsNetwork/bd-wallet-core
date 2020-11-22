import { expect } from 'chai';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { BtcWallet, DotWallet, EthWallet } from '../src';
import { BtcTestWallet } from './BtcTestWallet';

it ('polkdot has infinite addresses', async () => {
  await cryptoWaitReady();

  const wallet = new DotWallet('spare spin knife toward eye entry aspect clinic stadium segment tomato eyebrow');
  expect(wallet.getAddress()).to.equal('5HdNc28ENCXRExupogzgVAGM4tyLsa5WexhELiaVED4TowpG');
  expect(wallet.getAddress(0)).to.equal('5HTt3wJsc6ZKz3wW2BTVBRPTQNyYsPr5j2odFJSguxuukjZ8');
  expect(wallet.getAddress(1)).to.equal('5CoYUMmmu7LrrdFP6TKWVQgMHuCMXq85jhUsYKXascJG1Uvv');
  expect(wallet.getAddress(2)).to.equal('5CwNzJMnZ9GBUkhY5d1SHJ6Yk6fKt2Zw9XWZxyfZQYDhnnHK');

  expect(wallet.getAddress(1, 0)).to.equal('5EZhm419Ks6zVb2mcP13gUGNnc9zLiULgo6dfab745yqxzjQ');
  expect(wallet.getAddress(1, 0, 0)).to.equal('5GN1ZCk43meT8yRHbxHXGLjnfcQBriJdYLskpDpyWY5Fgx52');
  expect(wallet.getAddress(1, 0, 0, 0)).to.equal('5Cyz784L8vCCehNW57F5U1tP6FJqBUGRj6ruoZZLYnn6fmjz');
  expect(wallet.getAddress(1, 0, 0, 1)).to.equal('5EDCJHCFF9kerzDYnBY36uiaW7cwpLYP58FEVFkgx393ccFY');
});

it ('create btc bip44 addresses', () => {
  const wallet = new BtcWallet('rate myth arrest property shrimp board girl master faith venue dawn alien actor oxygen trial enrich deer furnace fox orange foster', false);

  expect(wallet.getAddress(0, 0).address).to.equal('12uFjrXfLtBJiAjtQtRuy8WJeJfA4PBVAR');
  expect(wallet.getAddress(0, 1).address).to.equal('17XmUHAnqNo7to1911bZTdHLwy9DmEQKWP');
  expect(wallet.getAddress(0, 4).address).to.equal('1HCTN2EHSuES7qBA1ZfjBjakBtRFHp56Fw');
  expect(wallet.getAddress(0, 59).address).to.equal('189KQceBEud19xtrgreemVvfCGvSmJVmwe');
  expect(wallet.getAddress(15, 3).address).to.equal('1j5zJcEV25SHDY7Yt67e5EXzH6sAMBwDU');
  expect(wallet.getAddress(15, 18, true).address).to.equal('1LyWZijEgWpBkRcZH2QNtrDRSNziJJG6Yu');
});

it ('create btc bip44 addresses with network of regtest', () => {
  const wallet = new BtcTestWallet('rate myth arrest property shrimp board girl master faith venue dawn alien actor oxygen trial enrich deer furnace fox orange foster', false);

  expect(wallet.getAddress(0, 0).address).to.equal('mqmeeFDcdJqQctsuscDEFWBP2P38CKX2jv');
  expect(wallet.getAddress(0, 59).address).to.equal('mmqjutwQVV76vM9rnzDtC5qpH47GqZVQnr');
});

it ('create btc bip49 addresses with network of regtest', () => {
  const wallet = new BtcTestWallet('rate myth arrest property shrimp board girl master faith venue dawn alien actor oxygen trial enrich deer furnace fox orange foster');

  expect(wallet.getAddress(0, 0).address).to.equal('2N7jD5HDSb9JrcWvVgKgYMUm5bh6M5Ayn3g');
  expect(wallet.getAddress(0, 59).address).to.equal('2MzS5eYFvsvsNSSsUZjmvuHkxqawZW8sPd5');
});

it ('create btc bip49 addresses', () => {
  const wallet = new BtcWallet('rate myth arrest property shrimp board girl master faith venue dawn alien actor oxygen trial enrich deer furnace fox orange foster');

  expect(wallet.getAddress(0, 0).address).to.equal('32eFSE3VquZDKVybggA9uMYaP4aQ2QB71X');
  expect(wallet.getAddress(0, 1).address).to.equal('36ZcQjJHmov6yg68t116z1T1gTQ6SxKXrp');
  expect(wallet.getAddress(0, 4).address).to.equal('32DQWnzTioMeDtWfX9d57BBuM1FM2yDTg6');
  expect(wallet.getAddress(0, 59).address).to.equal('35gknMqWkuj9jAbBYLWPYod2ZnCnASjTWS');
  expect(wallet.getAddress(15, 3).address).to.equal('3AGVE1go9fgixV58isELWiY2GUTUDGybAZ');
  expect(wallet.getAddress(15, 18, true).address).to.equal('37YWrXUuENisUJ2Wy5ij2E8V6bw4mt9XMS');
});

it ('create eth bip44 addresses', () => {
  const wallet = new EthWallet('rate myth arrest property shrimp board girl master faith venue dawn alien actor oxygen trial enrich deer furnace fox orange foster', null);

  expect(wallet.getAddress(0, 0).address).to.equal('0xDf524fC224faF883a10e313F04011ff91078A7C4');
  expect(wallet.getAddress(0, 1).address).to.equal('0xf3058805C8155c20537aa0c20ccCA7365EF9975E');
  expect(wallet.getAddress(0, 4).address).to.equal('0xF15914A70d914Ed52f13EDA6E43007e97860f810');
  expect(wallet.getAddress(0, 59).address).to.equal('0xE33ff6d054541af43B2CB6B6abdd51AA179CB244');
  expect(wallet.getAddress(15, 3).address).to.equal('0xF875A98D54CD2d5405cF72AC9bF2D87B06D33926');
  expect(wallet.getAddress(15, 18, true).address).to.equal('0x4F828D5b944F165Aa418EbE04438A617Aa6fA336');
});
