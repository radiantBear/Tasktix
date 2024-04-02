'use server';

import { execute, query } from './db_connect';
import { DB_ListSection } from './listSection';
import { DB_User } from './user';
import List, { extractListFromRow, mergeLists } from '@/lib/model/list';

export interface DB_ListMember extends DB_User {
  la_l_id: string;
  la_u_id: string;
  la_canAdd: boolean;
  la_canRemove: boolean;
  la_canComplete: boolean;
  la_canAssign: boolean;
}

export interface DB_List extends DB_ListMember, DB_ListSection {
  l_id: string;
  l_name: string;
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

export async function getListById(id: string): Promise<List|false> {
  const sql = `
    SELECT * FROM \`lists\`
    INNER JOIN \`listMembers\` ON \`listMembers\`.\`lm_l_id\` = \`lists\`.\`l_id\`
    INNER JOIN \`listSections\` ON \`listSections\`.\`ls_l_id\` = \`lists\`.\`l_id\`
    WHERE \`l_id\` = :id;
  `;
  
  const result = await query<DB_List>(sql, { id });
  
  if(!result)
    return false;

  return mergeLists(result.map(extractListFromRow))[0];
}

export async function getListsByUser(id: string): Promise<List[]|false> {
  const sql = `
    SELECT * FROM \`lists\`
    INNER JOIN \`listMembers\` ON \`listMembers\`.\`lm_l_id\` = \`lists\`.\`l_id\`
    WHERE \`listMembers\`.\`lm_u_id\` = :id
    ORDER BY \`lists\`.\`l_name\` ASC;
  `;
  
  const result = await query<DB_List>(sql, { id });
  
  if(!result)
    return false;

  return mergeLists(result.map(extractListFromRow));
}