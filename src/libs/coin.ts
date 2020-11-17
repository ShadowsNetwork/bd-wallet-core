import { networks, Network } from 'bitcoinjs-lib';

export const COIN = ['BTC', 'ETH'] as const;

export const networkMap: {
  [key in typeof COIN[number]]: Network;
} = {
  BTC: networks.bitcoin,
  ETH: networks.bitcoin,
};
