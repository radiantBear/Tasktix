import { ClientError, ServerError, Success } from '@/lib/Response';
import { createListItem } from '@/lib/database/listItem';
import ListItem from '@/lib/model/listItem';
import { getUser } from '@/lib/session';
import { validateListItemName } from '@/lib/validate';

export async function POST(request: Request) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const requestBody = await request.json();

  const name = requestBody.name;
  const dueDate = new Date(requestBody.dueDate);
  const priority = requestBody.priority;
  const sectionId = requestBody.sectionId;
  const expectedDuration = new Date(requestBody.duration);
  
  if(!name)
    return ClientError.BadRequest('Item name is required');
  if(!validateListItemName(name))
    return ClientError.BadRequest('Invalid item name');
  if(!dueDate)
    return ClientError.BadRequest('Invalid due date');
  if(!priority)
    return ClientError.BadRequest('Invalid priority');
  if(!sectionId)
    return ClientError.BadRequest('Invalid section ID');
  if(!expectedDuration)
    return ClientError.BadRequest('Invalid expected duration');
  

  const listItem = new ListItem(name, expectedDuration, { priority, dateDue: dueDate });

  const result = await createListItem(sectionId, listItem);

  if(!result)
    return ServerError.Internal('Could not create item');
  return Success.Created('Item created', `/item/${listItem.id}`);
}