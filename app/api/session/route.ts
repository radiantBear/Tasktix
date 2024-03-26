import { ClientError, ServerError, Success } from '@/lib/Response';
import { getUserByUsername, updateUser } from '@/lib/database/user';
import { setUser, getUser, clearUser } from '@/lib/session';

export async function GET(_: Request) {
  const session = await getUser();
  if(!session)
    return ClientError.NotFound('Not logged in');
  return Success.OK('Logged in');
}

export async function POST(request: Request) {
  const requestBody = await request.json();

  const username = requestBody.username;
  const password = requestBody.password;

  const user = await getUserByUsername(username);
  if(!user)
    return ClientError.BadRequest('Invalid username or password');

  user.dateLogin = new Date();
  /* _ = */ await updateUser(user);

  const match = user.password == password;
  if(!match)
    return ClientError.BadRequest('Invalid username or password');


  const result = await setUser(user.id);
  if(!result)
    return ServerError.Internal('Storing session failed');

  return Success.Created('Session started', `/api/session/${result}`);
}

export async function DELETE(_: Request) {
  const session = await getUser();
  if(!session)
    return ClientError.NotFound('Already logged out');
  
  const result = await clearUser();
  if(!result)
    return ServerError.Internal('Clearing session failed');

  return Success.OK('Session ended');
}