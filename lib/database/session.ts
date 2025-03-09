'use server';

import Session from '@/lib/model/session';
import { RowDataPacket } from 'mysql2/promise';
import { execute, query } from './db_connect';

interface DB_Session extends RowDataPacket {
  s_id: string;
  s_u_id: string;
  s_dateExpire: Date;
}

export async function createSession(session: Session): Promise<boolean> {
  const sql = `
    INSERT INTO \`sessions\`(
      \`s_id\`,
      \`s_u_id\`,
      \`s_dateExpire\`
    )
    VALUES (:id, :userId, :dateExpire);
  `;

  const result = await execute(sql, session);

  if (!result) return false;

  return true;
}

export async function getSessionById(id: string): Promise<Session | false> {
  const sql = `
    SELECT * FROM \`sessions\`
    WHERE \`s_id\` = :id;
  `;

  const result = await query<DB_Session>(sql, { id });

  if (!result) return false;

  return extractSessionFromRow(result[0]);
}

export async function deleteSession(id: string): Promise<boolean> {
  const sql = `
    DELETE FROM \`sessions\`
    WHERE \`s_id\` = :id;
  `;

  const result = await execute(sql, { id });

  if (!result) return false;

  return true;
}

function extractSessionFromRow(row: DB_Session): Session {
  const session = new Session(row.s_id);
  session.userId = row.s_u_id;
  session.dateExpire = new Date(row.s_dateExpire);

  return session;
}
