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

import Assignee from '@/lib/model/assignee';

import { DB_User, extractUserFromRow } from './user';

export interface DB_Assignee extends DB_User {
  ia_u_id: string;
  ia_i_id: string;
  ia_role: string;
}

export function extractAssigneeFromRow(row: DB_Assignee): Assignee {
  const user = extractUserFromRow(row);

  return new Assignee(user, row.ia_role);
}
