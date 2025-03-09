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
