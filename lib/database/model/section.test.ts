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

import { DB_Session, extractSessionFromRow } from './session';

describe('extractSessionFromRow', () => {
  test('Accurately extracts session from row data', () => {
    const row: DB_Session = {
      s_id: 'session-id',
      s_u_id: 'user-id',
      s_dateExpire: new Date('2023-10-01T00:00:00Z'),
      constructor: { name: 'RowDataPacket' }
    };

    const session = extractSessionFromRow(row);

    expect(session.id).toBe('session-id');
    expect(session.userId).toBe('user-id');
    expect(session.dateExpire).toEqual(new Date('2023-10-01T00:00:00Z'));
  });
});
