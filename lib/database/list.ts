'use server';

import Session from '@/lib/model/session';
import { RowDataPacket } from 'mysql2/promise';
import { execute, query } from './db_connect';
import List from '../model/list';

interface DB_List extends RowDataPacket {
  s_id: string;
  s_u_id: string;
  s_dateExpire: Date;
}

export async function createList(list: List): Promise<boolean> {
  const sql = `
    INSERT INTO \`lists\`(
      \`l_id\`,
      \`l_name\`
    )
    VALUES (:id, :name);
  `;
  
  const result = await execute(sql, list);
  
  if(!result)
    return false;

  for(const member of list.members) {
    const sql = `
      INSERT INTO \`listMembers\`(
        \`lm_u_id\`,
        \`lm_l_id\`,
        \`lm_canAdd\`,
        \`lm_canRemove\`,
        \`lm_canComplete\`,
        \`lm_canAssign\`
      )
      VALUES (:userId, :listId, :canAdd, :canRemove, :canComplete, :canAssign);
    `;

    const result = await execute(sql, {...member, userId: member.user.id, listId: list.id});
    if(!result)
      return false;
  }
  
  return true;
}

export async function getListById(id: string): Promise<Session|false> {
  const sql = `
    SELECT * FROM \`lists\`
    WHERE \`l_id\` = :id;
  `;
  
  const result = await query<DB_List>(sql, { id });
  
  if(!result)
    return false;

  return extractListFromRow(result[0]);
}


function extractListFromRow(row: DB_List): Session {
  const session = new Session(row.s_id);
  session.userId = row.s_u_id;
  session.dateExpire = new Date(row.s_dateExpire);

  return session;
}