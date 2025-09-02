import z from 'zod';

import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssignee } from '@/lib/database/list';
import { updateSectionIndices } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';
import { ZodListItem } from '@/lib/model/listItem';

const PatchBody = z.strictObject({
  itemId: ZodListItem.shape.id,
  index: ZodListItem.shape.sectionIndex,
  oldIndex: ZodListItem.shape.sectionIndex
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; sectionId: string } }
) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);

  if (!isMember) return ClientError.BadRequest('List not found');

  const parseResult = PatchBody.safeParse(await request.json());

  if (!parseResult.success)
    return ClientError.BadRequest('Invalid request data');

  const requestBody = parseResult.data;

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
