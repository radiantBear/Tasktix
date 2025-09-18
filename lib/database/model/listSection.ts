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

import ListSection from '@/lib/model/listSection';

import { DB_ListItem, extractListItemFromRow } from './listItem';

export interface DB_ListSection extends DB_ListItem {
  ls_id: string;
  ls_l_id: string;
  ls_name: string;
}

export function extractListSectionFromRow(row: DB_ListSection): ListSection {
  const listItem = row.i_id ? [extractListItemFromRow(row)] : [];

  return new ListSection(row.ls_name, listItem, row.ls_id);
}
