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

import ListMember from '@/lib/model/listMember';

import { DB_User, extractUserFromRow } from './user';

export interface DB_ListMember extends DB_User {
  lm_l_id: string;
  lm_u_id: string;
  lm_canAdd: boolean;
  lm_canRemove: boolean;
  lm_canComplete: boolean;
  lm_canAssign: boolean;
}

export function extractListMemberFromRow(row: DB_ListMember): ListMember {
  const user = extractUserFromRow(row);

  return new ListMember(
    user,
    row.lm_canAdd,
    row.lm_canRemove,
    row.lm_canComplete,
    row.lm_canAssign
  );
}
