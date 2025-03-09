'use server';

import Session from '@/lib/model/session';
import { execute, query } from './db_connect';
import { DB_Session, extractSessionFromRow } from './model/session';

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
