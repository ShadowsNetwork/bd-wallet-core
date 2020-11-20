import { expect } from 'chai';
import { BtcWallet, EthWallet } from '../src';

it ('can generate root key by mnimonic of 12 words', () => {
  const wallet = new BtcWallet('find involve enhance extend nut forum hollow update seed benefit elevator they');
  expect(wallet.getSeed().toString('hex')).to.equal('966586ffe1059f662fb7e85335ac2b508d928c3dc4267147d050e2ce5a9f66f5c682a0567200d3ccd481719061e4d2f244d2d29a1b46ec3b8dfdea6d82e56f75');
  expect(wallet.getRoot().toBase58()).to.equal('xprv9s21ZrQH143K283mVaZsDig3mbi7UfWWKGHXDU311ja6BzkxJbq1FU3p6uwcP9JgLQT7ZgMrZcdiDgha6o4HFgrrHXrXGV5mnmLEC4tUhUo');
});

it ('can generate root key by mnimonic of 15 words', () => {
  const wallet = new BtcWallet('guitar tumble defy clever wall raw food exact tenant page collect clarify tone dwarf supreme');
  expect(wallet.getSeed().toString('hex')).to.equal('c8a7766e640fd053a2de311df4dd27bbab1c1fbe1ea75d264265f2b968a8329ec7a56cba776fa837397fb42091055b628e45fdec0dbb3ca53d314f4a74fa6c0f');
  expect(wallet.getRoot().toBase58()).to.equal('xprv9s21ZrQH143K4HYNF1kcLR4KPe8LWdZ3jeWTevMYocUGMessAga3xZVqvG8tFz3dA6KRCfjc6qGmi4bYnbX8mgEjrfWfcTmCbau8N7z3UAJ');
});

it ('can generate root key by mnimonic of 18 words', () => {
  const wallet = new BtcWallet('install life soldier chuckle tonight trade regular combine marine tell stairs accuse retreat blast uniform real fringe clump');
  expect(wallet.getSeed().toString('hex')).to.equal('4990ded4d4b5569cd011ed0e3b12adbb48537b9be1669af8db5edac59959a940e09051d5448e76a1a6070c1485ca3eb35cbc711a85ec3aa67ab5c2f57a2e5a6c');
  expect(wallet.getRoot().toBase58()).to.equal('xprv9s21ZrQH143K4QDCcxjeQnAqDAxEVAhWFCgEKCFWUzpCUr9wfKP2oWAhSMVG5g6qPJ4fZa4c5GDuQjCRfowGqckeNwxzpPrFwa6cUJeSq9z');
});

it ('can generate root key mnimonic of 21 words', () => {
  const wallet = new BtcWallet('rate myth arrest property shrimp board girl master faith venue dawn alien actor oxygen trial enrich deer furnace fox orange foster');
  expect(wallet.getSeed().toString('hex')).to.equal('feebab8c444f51c619745987b59b54a368844acec0e43cc4aa5017bda7a53b9ef87216f4a74fc43d96b22d2b246861a2e28c3d5de4e51ac24b07536853c42483');
  expect(wallet.getRoot().toBase58()).to.equal('xprv9s21ZrQH143K4EWk1RnyAeQ2h7Cev565FPBa68ZVF667Vu1k8aw9MBPCRDeCa2c9nbYKQZTmuWPza3Q4kMP2RVCU8udgYa5W5N2bbtELxmY');
});

it ('btc and eth have the same root key', () => {
  const mnimonic = 'rate myth arrest property shrimp board girl master faith venue dawn alien actor oxygen trial enrich deer furnace fox orange foster';
  const btc = new BtcWallet(mnimonic);
  const eth = new EthWallet(mnimonic);

  expect(btc.getRoot().toBase58()).to.equal(eth.getRoot().toBase58());
});
