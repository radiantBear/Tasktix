import { ClientError, ServerError, Success } from '@/lib/Response';
import { deleteList } from '@/lib/database/list';
import { getUser } from '@/lib/session';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const result = await deleteList(params.id);

  if(!result)
    return ServerError.Internal('Could not delete list');
  return Success.OK('List deleted');
}