import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssignee } from '@/lib/database/list';
import { updateSectionIndices } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; sectionId: string } }
) {
  const user = await getUser();
  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);
  if (!isMember) return ClientError.BadRequest('List not found');

  const requestBody = await request.json();

  const itemId = requestBody.itemId;
  const index = requestBody.index;
  const oldIndex = requestBody.oldIndex;

  const result = await updateSectionIndices(
    params.sectionId,
    itemId,
    index,
    oldIndex
  );

  if (!result) return ServerError.Internal('Could not reorder items');
  return Success.OK('Items reordered');
}
