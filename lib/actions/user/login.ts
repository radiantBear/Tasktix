'use server';

import { validateUsername, validatePassword } from '@/lib/validate';
import { getUserByUsername, updateUser } from '@/lib/database/user';
import { redirect } from 'next/navigation';

export async function login(username: string, password: string) {
  if(!validateUsername(username))
    throw Error('Invalid username');
  if(!validatePassword(password).valid)
    throw Error('Invalid password');

  const user = await getUserByUsername(username);

  if(!user)
    throw Error('Invalid username or password');

  user.dateLogin = new Date();
  await updateUser(user);

  const match = user.password = password;
  
  if(!match)
    throw Error('Invalid username or password');

  redirect('/home');
}