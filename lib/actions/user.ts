'use server';

import { validateUsername, validateEmail, validatePassword } from '@/lib/validate';
import User from '@/lib/model/user';
import { createUser, getUserByUsername, getUserByEmail, updateUser } from '@/lib/database/user';
import { redirect } from 'next/navigation';
import { clearUser, setUser } from '@/lib/actions/session';

export async function register(username: string, email: string, password: string): Promise<{ message: string }> {
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

  let result = await createUser(user);
  
  if(!result)
    throw Error('Could not create user');

  result = await setUser(user.id);
  if(!result)
    throw Error('Storing session failed');

  redirect('/home');
}

export async function login(username: string, password: string): Promise<void> {
  const user = await getUserByUsername(username);
  if(!user)
    throw Error('Invalid username or password');

  user.dateLogin = new Date();
  /* _ = */ await updateUser(user);

  const match = user.password == password;
  if(!match)
    throw Error('Invalid username or password');

  const result = await setUser(user.id);
  if(!result)
    throw Error('Storing session failed');

  redirect('/home');
}

export async function logout(): Promise<void> {
  const result = await clearUser();
  if(!result)
    throw Error('Clearing session failed');

  redirect('/');
}