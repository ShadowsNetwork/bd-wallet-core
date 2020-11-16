import { BIP32Interface } from 'bip32';
import { bitcoinNetwork } from './bitcoin';

export enum COIN {
  BTC = 'BTC',
}

export const networks: {
  [key in COIN]: BIP32Interface['network'];
} = {
  BTC: bitcoinNetwork,
};
