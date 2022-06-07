import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';

const scrypt = promisify(_scrypt);

export const getHashPassword = async (password: string, salt: string) => {
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  return hash.toString('hex');
};
