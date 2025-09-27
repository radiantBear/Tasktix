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

import Session from '@/lib/model/session';

export interface DB_Session extends RowDataPacket {
  s_id: string;
  s_u_id: string;
  s_dateExpire: Date;
}

export function extractSessionFromRow(row: DB_Session): Session {
  const session = new Session(row.s_id);

  session.userId = row.s_u_id;
  session.dateExpire = new Date(row.s_dateExpire);

  return session;
}
