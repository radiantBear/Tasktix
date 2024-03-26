import { createSession, deleteSession } from '@/lib/database/session';
import { getUserBySessionId } from '@/lib/database/user';
import Session from '@/lib/model/session';
import User from '@/lib/model/user'
import { cookies } from 'next/headers'

export async function setUser(userId: string): Promise<boolean> {
  const session = new Session();
  const date = new Date();
  date.setDate(date.getDate() + 1);

  session.userId = userId;
  session.dateExpire = date;
  
  const result = await createSession(session);

  if(!result)
    return false;

  cookies().set('user', session.id, { expires: session.dateExpire });

  return true;
}

export async function getUser(): Promise<User|false> {
  const sessionId = cookies().get('user')?.value;

  if(!sessionId)
    return false;
  
  const user = await getUserBySessionId(sessionId);
  
  return user;
}

export async function clearUser(): Promise<boolean> {
  const session = new Session();

  const sessionId = cookies().get('user')?.value;

  if(!sessionId)
    return true;
  
  const result = await deleteSession(sessionId);

  if(!result)
    return false;

  cookies().delete('user');

  return true;
}