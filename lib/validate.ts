import { namedColorSet } from './model/color';

interface PasswordResult {
  valid: boolean;
  color: 'success' | 'warning' | 'danger' | 'default';
  // TODO: rename `strength` to `message`
  strength: string;
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  return usernameRegex.test(username) && username.length <= 32;
}

export function validateEmail(email: string): boolean {
  /* Credit: bortzeyer, https://stackoverflow.com/a/201378 */
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

  return emailRegex.test(email) && email.length <= 128;
}

export function validatePassword(password: string): PasswordResult {
  if (password.length > 128)
    return { valid: false, color: 'danger', strength: 'too long' };
  else if (password.length >= 16)
    return { valid: true, color: 'success', strength: 'strong' };
  else if (password.length >= 10)
    return { valid: true, color: 'warning', strength: 'acceptable' };
  else return { valid: false, color: 'danger', strength: 'weak' };
}

export function validateListName(name: string): [boolean, string] {
  return [name.length <= 64, name.substring(0, 64)];
}

export function validateListSectionName(name: string): [boolean, string] {
  return [name.length <= 64, name.substring(0, 64)];
}

export function validateListItemName(name: string): [boolean, string] {
  return [name.length <= 128, name.substring(0, 128)];
}

export function validateColor(color: string): boolean {
  // @ts-ignore: `.has()` can take any string and will return whether it is a named color
  return namedColorSet.has(color);
}
