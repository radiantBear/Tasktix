import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssignee } from '@/lib/database/list';
import { createTag } from '@/lib/database/list';
import Tag, { ZodTag } from '@/lib/model/tag';
import { getUser } from '@/lib/session';

const PostBody = ZodTag.omit({ id: true });

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssignee(user.id, params.id);

  if (!isMember) return ClientError.BadRequest('List not found');

  const parseResult = PostBody.safeParse(await request.json());

  if (!parseResult.success)
    return ClientError.BadRequest('Invalid request data');

  const requestBody = parseResult.data;

  const name = requestBody.name;
  const color = requestBody.color;

  const tag = new Tag(name, color);

  const result = await createTag(params.id, tag);

  if (!result) return ServerError.Internal('Could not create tag');

  return Success.Created('Tag created', `/item/${params.id}/tag/${tag.id}`);
}
