import { ClientError, ServerError, Success } from '@/lib/Response';
import { deleteListItem } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const result = await deleteListItem(params.id);

  if(!result)
    return ServerError.Internal('Could not delete item');
  return Success.OK('Item deleted');
}