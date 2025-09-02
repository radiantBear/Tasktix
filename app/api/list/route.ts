import { ClientError, ServerError, Success } from '@/lib/Response';
import { createList } from '@/lib/database/list';
import List, { ZodList } from '@/lib/model/list';
import ListMember from '@/lib/model/listMember';
import { getUser } from '@/lib/session';

const PostBody = ZodList.pick({ name: true, color: true });

export async function POST(request: Request) {
  const session = await getUser();

  if (!session) return ClientError.Unauthenticated('Not logged in');

  const parseResult = PostBody.safeParse(await request.json());

  if (!parseResult.success)
    return ClientError.BadRequest('Invalid request data');

  const requestBody = parseResult.data;

  const name = requestBody.name;
  const color = requestBody.color;

  const listMember = new ListMember(session, true, true, true, true);
  const list = new List(name, color, [listMember], [], true, true, true);

  const result = await createList(list);

  if (!result) return ServerError.Internal('Could not create list');

  return Success.Created('List created', `/list/${list.id}`);
}
