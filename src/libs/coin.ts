import { networks, Network } from 'bitcoinjs-lib';

export type COIN = 'BTC' | 'ETH' | 'DOT';

export const COIN_META: {
  [key in COIN]: {
    network: Network;
    id: number;
  };
} = {
  BTC: {
    id: 0,
    network: networks.bitcoin,
  },
  ETH: {
    id: 60,
    network: networks.bitcoin,
  },
  DOT: {
    id: 354,
    // FIXME:
    network: networks.bitcoin,
  },
};
