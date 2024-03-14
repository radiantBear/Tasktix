'use server'

import { validateUsername, validateEmail, validatePassword } from '@/lib/validate';

export async function register(username: string, email: string, password: string) {
  if(!validateUsername)
    throw Error('Invalid username');
  if(!validateEmail(email))
    throw Error('Invalid email address');
  if(!validatePassword(password).valid)
    throw Error('Invalid password');
  
  return { message: `Registered!` };
}