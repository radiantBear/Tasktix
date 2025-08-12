export function generateId(length: number = 16): string {
  const array = new Uint32Array(length);

  crypto.getRandomValues(array);

  const codeAlphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';

  let code: string = '';

  for (let i = 0; i < length; i++)
    code += codeAlphabet[array[i] % codeAlphabet.length];

  return code;
}
