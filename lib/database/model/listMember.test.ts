import { DB_ListMember, extractListMemberFromRow } from './listMember';
import ListMember from '@/lib/model/listMember';
import User from '@/lib/model/user';

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
