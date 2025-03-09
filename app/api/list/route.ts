import { ClientError, ServerError, Success } from '@/lib/Response';
import { createList } from '@/lib/database/list';
import List from '@/lib/model/list';
import ListMember from '@/lib/model/listMember';
import { getUser } from '@/lib/session';
import { validateColor, validateListName } from '@/lib/validate';

export async function POST(request: Request) {
  const session = await getUser();
  if (!session) return ClientError.Unauthenticated('Not logged in');

  const requestBody = await request.json();

  const name = requestBody.name;
  const color = requestBody.color;
  if (!name) return ClientError.BadRequest('List name is required');
  if (!validateListName(name))
    return ClientError.BadRequest('Invalid list name');
  if (!color) return ClientError.BadRequest('List color is required');
  if (!validateColor(color))
    return ClientError.BadRequest('Invalid list color');

  const listMember = new ListMember(session, true, true, true, true);
  const list = new List(name, color, [listMember], [], true, true, true);

  const result = await createList(list);

  if (!result) return ServerError.Internal('Could not create list');
  return Success.Created('List created', `/list/${list.id}`);
}
