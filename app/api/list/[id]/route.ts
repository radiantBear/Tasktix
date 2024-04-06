import { ClientError, ServerError, Success } from '@/lib/Response';
import { deleteList, getIsListAssignee } from '@/lib/database/list';
import { getUser } from '@/lib/session';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if(!user)
    return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);
  if(!isMember)
    return ClientError.BadRequest('List not found');

  const result = await deleteList(params.id);

  if(!result)
    return ServerError.Internal('Could not delete list');
  return Success.OK('List deleted');
}