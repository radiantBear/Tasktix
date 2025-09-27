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

import { DB_User, extractUserFromRow } from './user';

describe('extractUserFromRow', () => {
  test('Accurately extracts user from row data', () => {
    const row: DB_User = {
      u_id: 'user-id',
      u_username: 'username',
      u_email: 'test@example.com',
      u_password: 'secret',
      u_color: 'Emerald',
      u_dateCreated: new Date('2023-02-11 21:51:01'),
      u_dateSignedIn: new Date('2023-02-12 21:51:01'),
      constructor: { name: 'RowDataPacket' }
    };

    const user = extractUserFromRow(row);

    expect(user.id).toBe('user-id');
    expect(user.username).toBe('username');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('secret');
    expect(user.color).toBe('Emerald');
    expect(user.dateCreated).toEqual(new Date('2023-02-11 21:51:01'));
    expect(user.dateSignedIn).toEqual(new Date('2023-02-12 21:51:01'));
  });
});
