import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssigneeByItem } from '@/lib/database/list';
import { linkTag, unlinkTag } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export async function POST(
  _: Request,
  { params }: { params: { id: string; tagId: string } }
) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssigneeByItem(user.id, params.id);

  if (!isMember) return ClientError.BadRequest('List item not found');

  const result = await linkTag(params.id, params.tagId);

  if (!result) return ServerError.Internal('Could not add tag');

  return Success.OK('Tag added');
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; tagId: string } }
) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssigneeByItem(user.id, params.id);

  if (!isMember) return ClientError.BadRequest('List not found');

  const result = await unlinkTag(params.id, params.tagId);

  if (!result) return ServerError.Internal('Could not remove tag');

  return Success.OK('Tag removed');
}
