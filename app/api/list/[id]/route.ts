import { ClientError, ServerError, Success } from '@/lib/Response';
import { deleteList, getIsListAssignee, getListById, updateList } from '@/lib/database/list';
import { getUser } from '@/lib/session';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if(!user)
    return ClientError.Unauthenticated('Not logged in');

  const list = await getListById(params.id);
  if(!list)
    return ClientError.NotFound('List not found');

  const isMember = await getIsListAssignee(user.id, params.id);
  if(!isMember)
    return ClientError.BadRequest('List not found');


  const requestBody = await request.json();
  
  if(requestBody.name)
    list.name = requestBody.name;
  if(requestBody.hasTimeTracking != undefined)
    list.hasTimeTracking = requestBody.hasTimeTracking;
  if(requestBody.hasDueDates != undefined)
    list.hasDueDates = requestBody.hasDueDates;

  const result = await updateList(list);

  if(!result)
    return ServerError.Internal('Could not update list');
  return Success.OK('List updated');
}

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