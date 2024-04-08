import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssigneeBySection, getListBySectionId } from '@/lib/database/list';
import { createListItem } from '@/lib/database/listItem';
import ListItem from '@/lib/model/listItem';
import { getUser } from '@/lib/session';
import { validateListItemName } from '@/lib/validate';

export async function POST(request: Request) {
  const user = await getUser();
  if(!user)
    return ClientError.Unauthenticated('Not logged in');

  const requestBody = await request.json();

  const name = requestBody.name;
  const dueDate = requestBody.dueDate ? new Date(requestBody.dueDate) : null;
  const priority = requestBody.priority;
  const sectionId = requestBody.sectionId;
  const expectedMs = requestBody.duration || null;

  const isMember = await getIsListAssigneeBySection(user.id, sectionId);
  if(!isMember)
    return ClientError.BadRequest('List not found');

  const list = await getListBySectionId(sectionId);
  if(!list)
    return ClientError.BadRequest('List not found');
  
  if(!name)
    return ClientError.BadRequest('Item name is required');
  if(!validateListItemName(name))
    return ClientError.BadRequest('Invalid item name');
  if(!dueDate && list.hasDueDates)
    return ClientError.BadRequest('Invalid due date');
  if(!priority)
    return ClientError.BadRequest('Invalid priority');
  if(!sectionId)
    return ClientError.BadRequest('Invalid section ID');
  if(!expectedMs && list.hasTimeTracking)
    return ClientError.BadRequest('Invalid expected duration');

  const listItem = new ListItem(name, { priority, expectedMs, dateDue: dueDate });

  console.log(listItem)
  const result = await createListItem(sectionId, listItem);

  if(!result)
    return ServerError.Internal('Could not create item');
  return Success.Created('Item created', `/item/${listItem.id}`);
}