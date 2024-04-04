import { ClientError, ServerError, Success } from '@/lib/Response';
import { deleteListSection } from '@/lib/database/listSection';
import { getUser } from '@/lib/session';

export async function DELETE(_: Request, { params }: { params: { sectionId: string } }) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const result = await deleteListSection(params.sectionId);

  if(!result)
    return ServerError.Internal('Could not delete section');
  return Success.OK('Section deleted');
}