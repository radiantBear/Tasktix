import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssigneeByItem } from '@/lib/database/list';
import { linkAssignee, unlinkAssignee } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export async function POST(_: Request, { params }: { params: { id: string, userId: string } }) {
  const user = await getUser();
  if(!user)
    return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssigneeByItem(user.id, params.id);
  if(!isMember)
    return ClientError.BadRequest('List item not found');

  const result = await linkAssignee(params.id, params.userId, '');

  if(!result)
    return ServerError.Internal('Could not add tag');
  return Success.OK('Tag added');
}

export async function DELETE(_: Request, { params }: { params: { id: string, userId: string } }) {
  const user = await getUser();
  if(!user)
    return ClientError.Unauthenticated('Not logged in');
  
  const isMember = await getIsListAssigneeByItem(user.id, params.id);
  if(!isMember)
    return ClientError.BadRequest('List not found');

  const result = await unlinkAssignee(params.id, params.userId);

  if(!result)
    return ServerError.Internal('Could not remove tag');
  return Success.OK('Tag removed');
}