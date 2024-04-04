'use server';

import { extractTagFromRow } from '../model/tag';
import { execute, query } from './db_connect';
import { DB_Tag } from './listItem';
import { DB_ListSection } from './listSection';
import { DB_User } from './user';
import List, { extractListFromRow, mergeLists } from '@/lib/model/list';
import Tag from '@/lib/model/tag';

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
      LEFT JOIN \`listMembers\` ON \`listMembers\`.\`lm_l_id\` = \`lists\`.\`l_id\`
      LEFT JOIN \`listSections\` ON \`listSections\`.\`ls_l_id\` = \`lists\`.\`l_id\`
      LEFT JOIN \`items\` ON \`items\`.\`i_ls_id\` = \`listSections\`.\`ls_id\`
      LEFT JOIN \`itemTags\` ON \`itemTags\`.\`it_i_id\` = \`items\`.\`i_id\`
      LEFT JOIN \`tags\` ON \`tags\`.\`t_id\` = \`itemTags\`.\`it_t_id\`
      LEFT JOIN \`itemAssignees\` ON \`itemAssignees\`.\`ia_i_id\` = \`items\`.\`i_id\`
    WHERE \`l_id\` = :id
    ORDER BY \`listSections\`.\`ls_name\` ASC;
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

export async function getTagsByListId(id: string): Promise<Tag[]|false> {
  const sql = `
    SELECT * FROM \`tags\`
    WHERE \`tags\`.\`t_l_id\` = :id
    ORDER BY \`tags\`.\`t_name\` ASC;
  `;
  
  const result = await query<DB_Tag>(sql, { id });
  
  if(!result)
    return false;

  return result.map(extractTagFromRow);
}

export async function deleteList(id: string): Promise<boolean> {
  let sql = `
    DELETE FROM \`listMembers\` 
    WHERE \`lm_l_id\` = :id;
  `;
  
  let result = await execute(sql, { id });
  if(!result)
    return false;

  sql = `
  DELETE FROM \`lists\`
  WHERE \`l_id\` = :id;
  `;
  result = await execute(sql, { id });
  if(!result)
    return false;
  
  return true;
}