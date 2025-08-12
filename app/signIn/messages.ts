import { InputMessage } from '@/components/InputMessage';
import {
  validateUsername,
  validateEmail,
  validatePassword
} from '@/lib/validate';

export function getUsernameMessage(input: string): InputMessage {
  if (input)
    if (!validateUsername(input))
      return {
        message: 'Username can only have letters, numbers, and underscores',
        color: 'danger'
      };
    else
      return {
        message: '',
        color: 'success'
      };
  else
    return {
      message: 'Username is required',
      color: 'danger'
    };
}

export function getEmailMessage(input: string): InputMessage {
  if (input)
    if (!validateEmail(input))
      return {
        message: 'Please enter a valid email',
        color: 'danger'
      };
    else
      return {
        message: '',
        color: 'success'
      };
  else
    return {
      message: 'Email address is required',
      color: 'danger'
    };
}

export function getPasswordMessage(input: string): InputMessage {
  if (input) {
    const passwordResult = validatePassword(input);

    return {
      message: `Password is ${passwordResult.strength}`,
      color: passwordResult.color
    };
  } else
    return {
      message: `Password is required`,
      color: 'danger'
    };
}
