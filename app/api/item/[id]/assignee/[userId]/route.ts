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
import { getIsListAssigneeByItem } from '@/lib/database/list';
import { linkAssignee, unlinkAssignee } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export async function POST(
  _: Request,
  { params }: { params: { id: string; userId: string } }
) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssigneeByItem(user.id, params.id);

  if (!isMember) return ClientError.BadRequest('List item not found');

  const result = await linkAssignee(params.id, params.userId, '');

  if (!result) return ServerError.Internal('Could not add assignee');

  return Success.OK('Assignee added');
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; userId: string } }
) {
  const user = await getUser();

  if (!user) return ClientError.Unauthenticated('Not logged in');

  const isMember = await getIsListAssigneeByItem(user.id, params.id);

  if (!isMember) return ClientError.BadRequest('List not found');

  const result = await unlinkAssignee(params.id, params.userId);

  if (!result) return ServerError.Internal('Could not remove assignee');

  return Success.OK('Assignee removed');
}
