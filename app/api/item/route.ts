import { ClientError, ServerError, Success } from '@/lib/Response';
import {
  getIsListAssigneeBySection,
  getListBySectionId
} from '@/lib/database/list';
import { createListItem } from '@/lib/database/listItem';
import ListItem, { ZodListItem } from '@/lib/model/listItem';
import { getUser } from '@/lib/session';

const PostBody = ZodListItem.omit({
  id: true,
  status: true,
  isUnclear: true,
  elapsedMs: true,
  dateStarted: true,
  dateCompleted: true
});

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const parseResult = PostBody.safeParse(await request.json());

  if (!parseResult.success)
    return ClientError.BadRequest('Invalid request data');

  const requestBody = parseResult.data;

  const name = requestBody.name;
  const dateDue = requestBody.dateDue ? new Date(requestBody.dateDue) : null;
  const priority = requestBody.priority;
  const sectionId = requestBody.sectionId;
  const sectionIndex = requestBody.sectionIndex;
  const expectedMs = requestBody.expectedMs;

  const isMember = await getIsListAssigneeBySection(user.id, sectionId);

  if (!isMember) return ClientError.BadRequest('List not found');

  const list = await getListBySectionId(sectionId);

  if (!list) return ClientError.BadRequest('List not found');

  if (!dateDue && list.hasDueDates)
    return ClientError.BadRequest('Invalid due date');
  if (!expectedMs && list.hasTimeTracking)
    return ClientError.BadRequest('Invalid expected duration');

  const listItem = new ListItem(name, {
    priority,
    expectedMs,
    sectionIndex,
    dateDue: dateDue
  });

  const result = await createListItem(sectionId, listItem);

  if (!result) return ServerError.Internal('Could not create item');

  return Success.Created('Item created', `/item/${listItem.id}`);
}
