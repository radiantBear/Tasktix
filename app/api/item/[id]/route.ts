import { ClientError, ServerError, Success } from '@/lib/Response';
import { deleteListItem, getListItemById, updateListItem } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const requestBody = await request.json();

  const item = await getListItemById(params.id);
  if(!item)
    return ClientError.NotFound('List item not found');

  if(requestBody.status)
    item.status = requestBody.status;
  if(requestBody.elapsedDuration)
    item.elapsedDuration = new Date(requestBody.elapsedDuration);
  if(requestBody.startTime !== undefined)
    item.dateStarted = requestBody.startTime ? new Date(requestBody.startTime) : null;

  const result = await updateListItem(item);

  if(!result)
    return ServerError.Internal('Could not update item');
  return Success.OK('Item updated');
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const result = await deleteListItem(params.id);

  if(!result)
    return ServerError.Internal('Could not delete item');
  return Success.OK('Item deleted');
}