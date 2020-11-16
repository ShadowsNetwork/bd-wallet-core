import { fromSeed } from 'bip32';
import { COIN, networks } from './networks';

export const seedToRootKey = (seed: Buffer, coin: COIN): string => {
  return fromSeed(seed, networks[coin]).toBase58();
};
