/**
 * Tasktix: A powerful and flexible task-tracking tool for all.
 * Copyright (C) 2025 Nate Baird & other Tasktix contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
