import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssignee } from '@/lib/database/list';
import {
  deleteListSection,
  updateListSection
} from '@/lib/database/listSection';
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

  const name = requestBody.name;
  const id = params.sectionId;

  const result = await updateListSection(id, name);

  if (!result) return ServerError.Internal('Could not rename section');
  return Success.OK('Section renamed');
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; sectionId: string } }
) {
  const user = await getUser();
  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);
  if (!isMember) return ClientError.BadRequest('List not found');

  const result = await deleteListSection(params.sectionId);

  if (!result) return ServerError.Internal('Could not delete section');
  return Success.OK('Section deleted');
}
