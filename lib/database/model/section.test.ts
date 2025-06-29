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
