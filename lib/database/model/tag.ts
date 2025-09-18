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

import { RowDataPacket } from 'mysql2/promise';

import { NamedColor } from '@/lib/model/color';
import Tag from '@/lib/model/tag';

export interface DB_Tag extends RowDataPacket {
  t_id: string;
  t_name: string;
  t_color: NamedColor;
  t_i_id: string;
}

export function extractTagFromRow(row: DB_Tag): Tag {
  return new Tag(row.t_name, row.t_color, row.t_id);
}
