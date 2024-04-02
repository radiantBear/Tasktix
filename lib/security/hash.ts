import { BinaryLike, randomFill, scrypt } from 'crypto';

export async function hash(password: string): Promise<string> {
  function randomString(length: number = 16): Promise<BinaryLike> {
    return new Promise((resolve, reject) => {
      randomFill(new Uint8Array(length), (err, str) => {
        if(err)
          reject(err);
        resolve(str);
      });
    });
  }
  
  const salt = await randomString();

  return `${salt}:${await _hash(password, salt)}`;
}

export async function compare(password: string, hash: string): Promise<boolean> {
  const [saltString, otherPass, ...extra] = hash.split(':');

  if(extra.length || !otherPass)
    return false;

  const salt = Uint8Array.from(saltString.split(',').map(num => Number(num)));

  const hashedPassword = await _hash(password, salt);

  return hashedPassword === otherPass;
}

function _hash(password: string, salt: BinaryLike): Promise<string> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 128, (err: any, key) => {
      if(err)
        reject(err);
  
      resolve(key.toString('base64'));
    });
  });
}