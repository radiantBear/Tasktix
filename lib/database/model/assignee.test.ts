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

import User from '@/lib/model/user';

import { DB_Assignee, extractAssigneeFromRow } from './assignee';

describe('extractAssigneeFromRow', () => {
  test('Accurately extracts assignee data', () => {
    const row: DB_Assignee = {
      ia_i_id: 'item-id',
      ia_role: 'assignee-role',
      ia_u_id: 'user-id',
      u_id: 'user-id',
      u_username: 'username',
      u_email: 'test@example.com',
      u_password: 'secret',
      u_dateCreated: new Date('2023-01-01 04:32:17'),
      u_dateSignedIn: new Date('2023-06-14 19:01:37'),
      u_color: 'Amber',
      constructor: { name: 'RowDataPacket' }
    };

    const assignee = extractAssigneeFromRow(row);

    expect(assignee.role).toBe('assignee-role');
    expect(assignee.user).toEqual(
      new User(
        'username',
        'test@example.com',
        'secret',
        new Date('2023-01-01 04:32:17'),
        new Date('2023-06-14 19:01:37'),
        { id: 'user-id', color: 'Amber' }
      )
    );
  });
});
