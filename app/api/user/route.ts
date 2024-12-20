import { Success, ClientError, ServerError } from '@/lib/Response';
import { validateUsername, validateEmail, validatePassword } from '@/lib/validate';
import { createUser, getUserByUsername, getUserByEmail } from '@/lib/database/user';
import User from '@/lib/model/user';
import { hash } from '@/lib/security/hash';

export const dynamic = 'force-dynamic' as const; // defaults to auto

/**
 * Create a new user with `username`, `email`, and `password`
 */
export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const username = requestBody.username;
    const email = requestBody.email;
    const password = requestBody.password;

    if(!validateUsername(username))
      return ClientError.BadRequest('Invalid username');
    if(!validateEmail(email))
      return ClientError.BadRequest('Invalid email address');
    if(!validatePassword(password).valid)
      return ClientError.BadRequest('Invalid password');

    if(await getUserByUsername(username))
      return ClientError.BadRequest('Username unavailable');
    if(await getUserByEmail(email))
      return ClientError.BadRequest('Another account already uses this email');

    const user = new User(
      username,
      email,
      await hash(password),
      new Date(),
      new Date(),
      {}
    );

    let result = await createUser(user);
    
    if(!result)
      return ServerError.Internal('Could not create user');

    return Success.Created('User Created', `/api/user/${user.id}`);
  } catch(error: any) {
    return ServerError.Internal(error.toString());
  }
}