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

import ListItem, { Priority, Status } from '@/lib/model/listItem';

import { DB_Assignee, extractAssigneeFromRow } from './assignee';
import { DB_Tag, extractTagFromRow } from './tag';

export interface DB_ListItem extends DB_Assignee, DB_Tag {
  i_id: string;
  i_name: string;
  i_status: Status;
  i_priority: Priority;
  i_isUnclear: boolean;
  i_expectedMs: number | null;
  i_elapsedMs: number;
  i_parentId: string;
  i_ls_id: string;
  i_sectionIndex: number;
  i_dateCreated: Date;
  i_dateDue: Date | null;
  i_dateStarted: Date | null;
  i_dateCompleted: Date | null;
}

export function extractListItemFromRow(row: DB_ListItem): ListItem {
  const assignees = row.ia_role ? [extractAssigneeFromRow(row)] : [];

  const tags = row.t_id ? [extractTagFromRow(row)] : [];

  const listItem = new ListItem(row.i_name, {
    id: row.i_id,
    status: row.i_status,
    priority: row.i_priority,
    isUnclear: row.i_isUnclear,
    expectedMs: row.i_expectedMs,
    elapsedMs: row.i_elapsedMs,
    sectionIndex: row.i_sectionIndex,
    dateCreated: new Date(row.i_dateCreated),
    dateDue: row.i_dateDue ? new Date(row.i_dateDue) : null,
    dateStarted: row.i_dateStarted ? new Date(row.i_dateStarted) : null,
    dateCompleted: row.i_dateCompleted ? new Date(row.i_dateCompleted) : null,
    assignees,
    tags,
    listId: row.l_id,
    sectionId: row.ls_id
  });

  return listItem;
}

// Expects list items to be sorted by item ID, then assignee user ID and tag ID
export function extractListItemsFromRows(rows: DB_ListItem[]): ListItem[] {
  const listItems: ListItem[] = [];

  for (const item of rows) {
    const lastItem = listItems.at(-1);

    if (lastItem?.id == item.i_id) {
      if (lastItem.assignees.at(-1)?.user.id != item.ia_u_id)
        lastItem.assignees.push(extractAssigneeFromRow(item));
      if (lastItem.tags.at(-1)?.id != item.t_id)
        lastItem.tags.push(extractTagFromRow(item));
    } else {
      listItems.push(extractListItemFromRow(item));
    }
  }

  return listItems;
}
