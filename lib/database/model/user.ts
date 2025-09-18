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
import User from '@/lib/model/user';

export interface DB_User extends RowDataPacket {
  u_id: string;
  u_username: string;
  u_email: string;
  u_password: string;
  u_color: NamedColor;
  u_dateCreated: Date;
  u_dateSignedIn: Date;
}

export function extractUserFromRow(row: DB_User): User {
  const user = new User(
    row.u_username,
    row.u_email,
    row.u_password,
    new Date(row.u_dateCreated),
    new Date(row.u_dateSignedIn),
    {
      id: row.u_id,
      color: row.u_color
    }
  );

  return user;
}
