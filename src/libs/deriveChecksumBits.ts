import createHash from 'create-hash';
import { bytesToBinary } from './byteToBinary';

export function deriveChecksumBits(entropyBuffer: Buffer) {
  const ENT = entropyBuffer.length * 8;
  const CS = ENT / 32;
  const hash = createHash('sha256')
      .update(entropyBuffer)
      .digest();

  return bytesToBinary(Array.from(hash)).slice(0, CS);
};
