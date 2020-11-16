import { normalize } from './libs/normalize';
import { salt } from './libs/salt';
import pbkdf2 from 'pbkdf2';

export const mnemonicToSeed = (mnemonic: string, password?: string): string => {
  const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
  const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');

  return pbkdf2
    .pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512')
    .toString('hex');
};
