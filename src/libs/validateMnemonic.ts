import { mnemonicToEntropy } from '../mnemonicToEntropy';

export function validateMnemonic(mnemonic: string) {
  try {
      mnemonicToEntropy(mnemonic);
  } catch (e) {
      return false;
  }
  return true;
}
