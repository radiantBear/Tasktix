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
import User from '@/lib/model/user';

import { DB_ListMember, extractListMemberFromRow } from './listMember';

describe('extractListMemberFromRow', () => {
  test('Accurately extracts list member from row data', () => {
    const row: DB_ListMember = {
      lm_l_id: 'list-id',
      lm_u_id: 'user-id',
      lm_canAdd: true,
      lm_canRemove: false,
      lm_canComplete: true,
      lm_canAssign: false,
      u_id: 'user-id',
      u_username: 'username',
      u_email: 'test@example.com',
      u_password: 'secret',
      u_color: 'Emerald',
      u_dateCreated: new Date('2023-02-11 21:51:01'),
      u_dateSignedIn: new Date('2023-02-11 21:51:01'),
      constructor: { name: 'RowDataPacket' }
    };

    const listMember = extractListMemberFromRow(row);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(listMember).toEqual(new ListMember(user, true, false, true, false));
  });

  test('Accurately extracts list member with different permissions from row data', () => {
    const row: DB_ListMember = {
      lm_l_id: 'list-id',
      lm_u_id: 'user-id',
      lm_canAdd: false,
      lm_canRemove: true,
      lm_canComplete: true,
      lm_canAssign: false,
      u_id: 'user-id',
      u_username: 'username',
      u_email: 'test@example.com',
      u_password: 'secret',
      u_color: 'Emerald',
      u_dateCreated: new Date('2023-02-11 21:51:01'),
      u_dateSignedIn: new Date('2023-02-11 21:51:01'),
      constructor: { name: 'RowDataPacket' }
    };

    const listMember = extractListMemberFromRow(row);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(listMember).toEqual(new ListMember(user, false, true, true, false));
  });
});
