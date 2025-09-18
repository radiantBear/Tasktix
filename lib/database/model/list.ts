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

import { NamedColor } from '@/lib/model/color';
import List from '@/lib/model/list';

import { DB_ListSection, extractListSectionFromRow } from './listSection';
import { DB_ListMember, extractListMemberFromRow } from './listMember';
import { extractListItemFromRow } from './listItem';
import { extractTagFromRow } from './tag';
import { extractAssigneeFromRow } from './assignee';

export interface DB_List extends DB_ListMember, DB_ListSection {
  l_id: string;
  l_color: NamedColor;
  l_name: string;
  l_hasTimeTracking: boolean;
  l_hasDueDates: boolean;
  l_isAutoOrdered: boolean;
}

export function extractListFromRow(row: DB_List): List {
  const listMember = row.lm_u_id ? [extractListMemberFromRow(row)] : [];

  const listSection = row.ls_id ? [extractListSectionFromRow(row)] : [];

  const list = new List(
    row.l_name,
    row.l_color,
    listMember,
    listSection,
    row.l_hasTimeTracking,
    row.l_hasDueDates,
    row.l_isAutoOrdered,
    row.l_id
  );

  list.id = row.l_id;

  return list;
}

// Expects lists to be sorted by list ID, then list member user ID, list section ID, list item ID, assignee user ID, and finally tag ID
export function extractListsFromRows(rows: DB_List[]): List[] {
  const lists: List[] = [];

  for (const list of rows) {
    const last = lists.at(-1);

    if (last?.id == list.l_id) {
      const lastSection = last.sections.at(-1);
      const lastItem = lastSection?.items.at(-1);

      if (list.lm_u_id && last.members.at(-1)?.user.id != list.lm_u_id)
        last.members.push(extractListMemberFromRow(list));
      else if (lastSection?.id != list.ls_id)
        last.sections.push(extractListSectionFromRow(list));
      else if (lastItem?.id != list.i_id)
        lastSection.items.push(extractListItemFromRow(list));
      else if (lastItem?.assignees.at(-1)?.user.id != list.ia_u_id)
        lastItem.assignees.push(extractAssigneeFromRow(list));
      else if (lastItem?.tags.at(-1)?.id != list.t_id)
        lastItem.tags.push(extractTagFromRow(list));
      else throw new Error('Unexpected duplication');
    } else {
      lists.push(extractListFromRow(list));
    }
  }

  return lists;
}
