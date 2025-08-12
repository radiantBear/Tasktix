import { ClientError, ServerError, Success } from '@/lib/Response';
import {
  deleteTag,
  getIsListAssignee,
  getTagById,
  updateTag
} from '@/lib/database/list';
import { getUser } from '@/lib/session';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; tagId: string } }
) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);

  if (!isMember) return ClientError.BadRequest('List not found');

  const tag = await getTagById(params.tagId);

  if (!tag) return ClientError.BadRequest('Tag not found');

  const requestBody = await request.json();

  if (requestBody.name) tag.name = requestBody.name;
  if (requestBody.color) tag.color = requestBody.color;

  const result = await updateTag(params.id, tag);

  if (!result) return ServerError.Internal('Could not add tag');

  return Success.OK('Tag added');
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; tagId: string } }
) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);

  if (!isMember) return ClientError.BadRequest('List not found');

  const result = await deleteTag(params.tagId);

  if (!result) return ServerError.Internal('Could not remove tag');

  return Success.OK('Tag removed');
}
