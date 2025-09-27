/**
 * Tasktix: A powerful and flexible task-tracking tool for all.
 * Copyright (C) 2025 Nate Baird & other Tasktix contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ClientError, ServerError, Success } from '@/lib/Response';
import { getIsListAssignee } from '@/lib/database/list';
import {
  deleteListSection,
  updateListSection
} from '@/lib/database/listSection';
import { ZodListSection } from '@/lib/model/listSection';
import { getUser } from '@/lib/session';

const PatchBody = ZodListSection.omit({ id: true });

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
