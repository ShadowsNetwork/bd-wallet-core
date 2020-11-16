import { BIP32Interface } from 'bip32';

export const bitcoinNetwork: BIP32Interface['network'] = {
  "messagePrefix": "\u0018Bitcoin Signed Message:",
  "bech32": "bc",
  "bip32": {
    "public": 76067358,
    "private": 76066276
  },
  "pubKeyHash": 0,
  "scriptHash": 5,
  "wif": 128,
}
