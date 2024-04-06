import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssignee } from '@/lib/database/list';
import { createTag } from '@/lib/database/listItem';
import Tag from '@/lib/model/tag';
import { getUser } from '@/lib/session';
import { validateColor } from '@/lib/validate';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if(!user)
    return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);
  if(!isMember)
    return ClientError.BadRequest('List not found');

  const requestBody = await request.json();

  const name = requestBody.name;
  const color = requestBody.color;
  
  if(!name)
    return ClientError.BadRequest('Tag name is required');
  if(!validateColor(color))
    return ClientError.BadRequest('Invalid color');

  const tag = new Tag(name, color);

  const result = await createTag(params.id, tag);

  if(!result)
    return ServerError.Internal('Could not create tag');
  return Success.Created('Tag created', `/item/${params.id}/tag/${tag.id}`);
}