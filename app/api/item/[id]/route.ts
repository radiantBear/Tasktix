import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssigneeByItem } from '@/lib/database/list';
import { deleteListItem, getListItemById, updateListItem } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if(!user)
    return ClientError.Unauthenticated('Not logged in');

  const item = await getListItemById(params.id);
  if(!item)
    return ClientError.NotFound('List item not found');

  const isMember = await getIsListAssigneeByItem(user.id, params.id);
  if(!isMember)
    return ClientError.BadRequest('List item not found');


  const requestBody = await request.json();
  
  if(requestBody.name)
    item.name = requestBody.name;
  if(requestBody.status)
    item.status = requestBody.status;
  if(requestBody.priority)
    item.priority = requestBody.priority;
  if(requestBody.elapsedMs)
    item.elapsedMs = requestBody.elapsedMs;
  if(requestBody.startTime !== undefined)
    item.dateStarted = requestBody.startTime ? new Date(requestBody.startTime) : null;
  if(requestBody.dateCompleted !== undefined)
    item.dateCompleted = requestBody.dateCompleted ? new Date(requestBody.dateCompleted) : null;

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