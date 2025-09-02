import { ClientError, ServerError, Success } from '@/lib/Response';
import { getUserByUsername, updateUser } from '@/lib/database/user';
import { compare } from '@/lib/security/hash';
import { setUser, getUser, clearUser } from '@/lib/session';
import { ZodUser } from '@/lib/model/user';

const PostBody = ZodUser.pick({ username: true, password: true });

export async function GET(_: Request) {
  const session = await getUser();

  if (!session) return ClientError.NotFound('Not logged in');

  return Success.OK('Logged in');
}

export async function POST(request: Request) {
  const parseResult = PostBody.safeParse(await request.json());

  if (!parseResult.success)
    return ClientError.BadRequest('Invalid request body');

  const requestBody = parseResult.data;

  const username = requestBody.username;
  const password = requestBody.password;

  const user = await getUserByUsername(username);

  if (!user) return ClientError.BadRequest('Invalid username or password');

  // TODO: should only update login time after successful login
  user.dateSignedIn = new Date();
  /* _ = */ await updateUser(user);

  if (!user.password)
    return ClientError.BadRequest('Invalid username or password');
  const match = await compare(password, user.password);

  if (!match) return ClientError.BadRequest('Invalid username or password');

  const result = await setUser(user.id);

  if (!result) return ServerError.Internal('Storing session failed');

  return Success.Created('Session started', `/api/session/${result}`);
}

export async function DELETE(_: Request) {
  const session = await getUser();

  if (!session) return ClientError.NotFound('Already logged out');

  const result = await clearUser();

  if (!result) return ServerError.Internal('Clearing session failed');

  return Success.OK('Session ended');
}
