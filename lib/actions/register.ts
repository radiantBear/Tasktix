'use server'

import { validateUsername, validateEmail, validatePassword } from '@/lib/validate';
import { createUser } from '@/lib/database';

export async function register(username: string, email: string, password: string) {
  if(!validateUsername(username))
    throw Error('Invalid username');
  if(!validateEmail(email))
    throw Error('Invalid email address');
  if(!validatePassword(password).valid)
    throw Error('Invalid password');

  if(createUser(username, email, password))
    return { message: `Registered!` };
  throw Error('Could not register user');
}