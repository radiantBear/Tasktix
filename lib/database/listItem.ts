'use server';

import { DB_User } from './user';
import { execute, query } from './db_connect';
import ListItem, { Priority, Status, extractListItemFromRow, mergeListItems } from '@/lib/model/listItem';
import Color from '@/lib/model/color';
import Tag from '@/lib/model/tag';
import { RowDataPacket } from 'mysql2';

export interface DB_Tag extends RowDataPacket {
  t_id: string;
  t_name: string;
  t_color: Color;
  t_i_id: string;
}

export interface DB_Assignee extends DB_User {
  ia_u_id: string;
  ia_i_id: string;
  ia_role: string;
  ia_color: Color;
}

export interface DB_ListItem extends DB_Assignee, DB_Tag {
  i_id: string;
  i_name: string;
  i_status: Status;
  i_priority: Priority;
  i_isUnclear: boolean;
  i_expectedDuration: string;
  i_elapsedDuration: string;
  i_parentId: string;
  i_ls_id: string;
  i_dateCreated: Date;
  i_dateDue: Date;
  i_dateStarted: Date|null;
}

export async function createListItem(sectionId: string, listItem: ListItem): Promise<boolean> {
  const sql = `
    INSERT INTO \`items\`(
      \`i_id\`,
      \`i_name\`,
      \`i_status\`,
      \`i_priority\`,
      \`i_isUnclear\`,
      \`i_expectedDuration\`,
      \`i_elapsedDuration\`,
      \`i_parentId\`,
      \`i_ls_id\`,
      \`i_dateCreated\`,
      \`i_dateDue\`,
      \`i_dateStarted\`
    )
    VALUES (
      :id,
      :name,
      :status,
      :priority,
      :isUnclear,
      :expectedDuration,
      :elapsedDuration,
      NULL,
      :sectionId,
      :dateCreated,
      :dateDue,
      :dateStarted
    );
  `;
  
  const result = await execute(sql, { sectionId, ...listItem });
  
  if(!result)
    return false;
  
  return true;
}

export async function createTag(listId: string, tag: Tag): Promise<boolean> {
  const sql = `
    INSERT INTO \`tags\`(
      \`t_id\`,
      \`t_name\`,
      \`t_color\`,
      \`t_l_id\`
    )
    VALUES (
      :id,
      :name,
      :color,
      :listId
    );
  `;
  
  const result = await execute(sql, { listId, ...tag });
  
  if(!result)
    return false;
  
  return true;
}

export async function getListItemById(id: string): Promise<ListItem|false> {
  const sql = `
    SELECT * FROM \`items\`
      LEFT JOIN \`itemTags\` ON \`itemTags\`.\`it_i_id\` = \`items\`.\`i_id\`
      LEFT JOIN \`tags\` ON \`tags\`.\`t_id\` = \`itemTags\`.\`it_t_id\`
      LEFT JOIN \`itemAssignees\` ON \`itemAssignees\`.\`ia_i_id\` = \`items\`.\`i_id\`
    WHERE \`i_id\` = :id
    ORDER BY \`tags\`.\`t_name\` ASC;
  `;

  const result = await query<DB_ListItem>(sql, { id });

  if(!result)
    return false;

  return mergeListItems(result.map(extractListItemFromRow))[0];
}

export async function linkTag(itemId: string, tagId: string): Promise<boolean> {
  const sql = `
    INSERT INTO \`itemTags\`(
      \`it_i_id\`,
      \`it_t_id\`
    )
    VALUES (
      :itemId,
      :tagId
    );
  `;
  
  const result = await execute(sql, { itemId, tagId });
  
  if(!result)
    return false;
  
  return true;
}

export async function updateListItem(item: ListItem): Promise<boolean> {
  const sql = `
    UPDATE \`items\` SET 
      \`i_name\` = :name,
      \`i_status\` = :status,
      \`i_priority\` = :priority,
      \`i_isUnclear\` = :isUnclear,
      \`i_expectedDuration\` = :expectedDuration,
      \`i_elapsedDuration\` = :elapsedDuration,
      \`i_dateCreated\` = :dateCreated,
      \`i_dateDue\` = :dateDue,
      \`i_dateStarted\` = :dateStarted
    WHERE \`i_id\` = :id;
  `;
  
  const result = await execute(sql, { ...item });

  if(!result)
    return false;

  return true;
}

export async function deleteListItem(id: string): Promise<boolean> {
  const sql = `
    DELETE FROM \`items\`
    WHERE \`i_id\` = :id;
  `;
  
  const result = await execute(sql, { id });
  
  if(!result)
    return false;
  
  return true;
}

export async function unlinkTag(itemId: string, tagId: string): Promise<boolean> {
  const sql = `
    DELETE FROM \`itemTags\`
    WHERE \`it_i_id\` = :itemId
      AND \`it_t_id\` = :tagId;
  `;
  
  const result = await execute(sql, { itemId, tagId });
  
  if(!result)
    return false;
  
  return true;
}