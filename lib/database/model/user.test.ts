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
