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
