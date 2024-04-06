import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssignee } from '@/lib/database/list';
import { createListSection } from '@/lib/database/listSection';
import ListSection from '@/lib/model/listSection';
import { getUser } from '@/lib/session';
import { validateListSectionName } from '@/lib/validate';

export async function POST(request: Request, { params }: { params: {id: string} }) {
  const user = await getUser();
  if(!user)
    return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);
  if(!isMember)
    return ClientError.BadRequest('List not found');

  const requestBody = await request.json();

  const name = requestBody.name;
  if(!name)
    return ClientError.BadRequest('Section name is required');
  if(!validateListSectionName(name))
    return ClientError.BadRequest('Invalid section name');
  
  const listSection = new ListSection(name, []);

  const result = await createListSection(params.id, listSection);

  if(!result)
    return ServerError.Internal('Could not create section');
  return Success.Created('Section created', `/list/${params.id}/section/${listSection.id}`);
}