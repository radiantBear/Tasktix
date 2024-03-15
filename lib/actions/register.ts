'use server';

import { validateUsername, validateEmail, validatePassword } from '@/lib/validate';
import User from '@/lib/model/user';
import { createUser, getUserByUsername, getUserByEmail } from '@/lib/database/user';

export async function register(username: string, email: string, password: string) {
  if(!validateUsername(username))
    throw Error('Invalid username');
  if(!validateEmail(email))
    throw Error('Invalid email address');
  if(!validatePassword(password).valid)
    throw Error('Invalid password');

  if(await getUserByUsername(username))
    throw Error('Username unavailable');
  if(await getUserByEmail(email))
    throw Error('Another account already uses this email');

  const user = new User();
  user.username = username;
  user.email = email;
  user.password = password;
  user.dateCreated = new Date();
  user.dateLogin = new Date();

  const result = await createUser(user);
  
  if(!result)
    throw Error('Could not create user');

  return { message: 'User created' };
}