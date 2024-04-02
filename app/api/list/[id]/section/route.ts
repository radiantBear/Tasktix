import { ClientError, ServerError, Success } from '@/lib/Response';
import { createListSection } from '@/lib/database/listSection';
import ListSection from '@/lib/model/listSection';
import { getUser } from '@/lib/session';
import { validateListSectionName } from '@/lib/validate';

export async function POST(request: Request, { params }: { params: {id: string} }) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const requestBody = await request.json();

  const name = requestBody.name;
  if(!name)
    return ClientError.BadRequest('Section name is required');
  if(!validateListSectionName(name))
    return ClientError.BadRequest('Invalid section name');
  
  const listSection = new ListSection(name);

  const result = await createListSection(params.id, listSection);

  if(!result)
    return ServerError.Internal('Could not create section');
  return Success.Created('Section created', `/list/${params.id}/section/${listSection.id}`);
}