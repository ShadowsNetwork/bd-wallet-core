import { leftPad } from './leftPad';

export function bytesToBinary(bytes: number[]) {
  return bytes.map((x) => leftPad(x.toString(2), '0', 8)).join('');
}
