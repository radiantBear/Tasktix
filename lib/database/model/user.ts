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
