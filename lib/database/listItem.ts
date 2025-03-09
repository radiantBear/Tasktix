'use server';

import { DB_User } from './user';
import { execute, query } from './db_connect';
import ListItem, {
  Priority,
  Status,
  extractListItemFromRow,
  mergeListItems
} from '@/lib/model/listItem';
import { NamedColor } from '@/lib/model/color';
import Tag from '@/lib/model/tag';
import { RowDataPacket } from 'mysql2';

export interface DB_Tag extends RowDataPacket {
  t_id: string;
  t_name: string;
  t_color: NamedColor;
  t_i_id: string;
}

export interface DB_Assignee extends DB_User {
  ia_u_id: string;
  ia_i_id: string;
  ia_role: string;
}

export interface DB_ListItem extends DB_Assignee, DB_Tag {
  i_id: string;
  i_name: string;
  i_status: Status;
  i_priority: Priority;
  i_isUnclear: boolean;
  i_expectedMs: number | null;
  i_elapsedMs: number;
  i_parentId: string;
  i_ls_id: string;
  i_sectionIndex: number;
  i_dateCreated: Date;
  i_dateDue: Date | null;
  i_dateStarted: Date | null;
  i_dateCompleted: Date | null;
}

export async function createListItem(
  sectionId: string,
  listItem: ListItem
): Promise<boolean> {
  const sql = `
    INSERT INTO \`items\`(
      \`i_id\`,
      \`i_name\`,
      \`i_status\`,
      \`i_priority\`,
      \`i_isUnclear\`,
      \`i_expectedMs\`,
      \`i_elapsedMs\`,
      \`i_parentId\`,
      \`i_ls_id\`,
      \`i_sectionIndex\`,
      \`i_dateCreated\`,
      \`i_dateDue\`,
      \`i_dateStarted\`,
      \`i_dateCompleted\`
    )
    VALUES (
      :id,
      :name,
      :status,
      :priority,
      :isUnclear,
      :expectedMs,
      :elapsedMs,
      NULL,
      :sectionId,
      :sectionIndex,
      :dateCreated,
      :dateDue,
      :dateStarted,
      :dateCompleted
    );
  `;

  const result = await execute(sql, { ...listItem, sectionId });

  if (!result) return false;

  return true;
}

export async function getListItemById(id: string): Promise<ListItem | false> {
  const sql = `
    SELECT * FROM \`items\`
      LEFT JOIN \`itemTags\` ON \`itemTags\`.\`it_i_id\` = \`items\`.\`i_id\`
      LEFT JOIN \`tags\` ON \`tags\`.\`t_id\` = \`itemTags\`.\`it_t_id\`
      LEFT JOIN \`itemAssignees\` ON \`itemAssignees\`.\`ia_i_id\` = \`items\`.\`i_id\`
    WHERE \`i_id\` = :id
    ORDER BY \`tags\`.\`t_name\` ASC;
  `;

  const result = await query<DB_ListItem>(sql, { id });

  if (!result) return false;

  return mergeListItems(result.map(extractListItemFromRow))[0];
}

export async function getListItemsByUser(
  userId: string
): Promise<ListItem[] | false> {
  const sql = `
    SELECT * FROM \`items\`
      LEFT JOIN \`itemTags\` ON \`itemTags\`.\`it_i_id\` = \`items\`.\`i_id\`
      LEFT JOIN \`tags\` ON \`tags\`.\`t_id\` = \`itemTags\`.\`it_t_id\`
      LEFT JOIN \`itemAssignees\` ON \`itemAssignees\`.\`ia_i_id\` = \`items\`.\`i_id\`
      INNER JOIN \`listSections\` ON \`listSections\`.\`ls_id\` = \`items\`.\`i_ls_id\`
      INNER JOIN \`lists\` ON \`lists\`.\`l_id\` = \`listSections\`.\`ls_l_id\`
      INNER JOIN \`listMembers\` ON \`listMembers\`.\`lm_l_id\` = \`listSections\`.\`ls_l_id\`
    WHERE \`listMembers\`.\`lm_u_id\` = :userId
    ORDER BY \`items\`.\`i_id\` ASC, \`tags\`.\`t_name\` ASC;
  `;

  const result = await query<DB_ListItem>(sql, { userId });

  if (!result) return false;

  return mergeListItems(result.map(extractListItemFromRow));
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

  if (!result) return false;

  return true;
}

export async function linkAssignee(
  itemId: string,
  userId: string,
  role: string
): Promise<boolean> {
  const sql = `
    INSERT INTO \`itemAssignees\`(
      \`ia_i_id\`,
      \`ia_u_id\`,
      \`ia_role\`
    )
    VALUES (
      :itemId,
      :userId,
      :role
    );
  `;

  const result = await execute(sql, { itemId, userId, role });

  if (!result) return false;

  return true;
}

export async function updateListItem(item: ListItem): Promise<boolean> {
  const sql = `
    UPDATE \`items\` SET 
      \`i_name\` = :name,
      \`i_status\` = :status,
      \`i_priority\` = :priority,
      \`i_isUnclear\` = :isUnclear,
      \`i_expectedMs\` = :expectedMs,
      \`i_elapsedMs\` = :elapsedMs,
      \`i_sectionIndex\` = :sectionIndex,
      \`i_dateCreated\` = :dateCreated,
      \`i_dateDue\` = :dateDue,
      \`i_dateStarted\` = :dateStarted,
      \`i_dateCompleted\` = :dateCompleted
    WHERE \`i_id\` = :id;
  `;

  const result = await execute(sql, { ...item });

  if (!result) return false;

  return true;
}

export async function updateSectionIndices(
  sectionId: string,
  itemId: string,
  index: number,
  oldIndex: number
): Promise<boolean> {
  const sql = `
    UPDATE \`items\`
    SET \`i_sectionIndex\` = CASE 
      WHEN i_id = :itemId 
        THEN :index
        ELSE \`i_sectionIndex\` ${oldIndex > index ? '+ 1' : '- 1'}
      END
    WHERE i_ls_id = :sectionId
      AND i_sectionIndex >= :indexOne
      AND i_sectionIndex <= :indexTwo;
  `;

  const result = await execute(sql, {
    sectionId,
    itemId,
    index,
    indexOne: Math.min(oldIndex, index),
    indexTwo: Math.max(oldIndex, index)
  });

  if (!result) return false;

  return true;
}

export async function deleteListItem(id: string): Promise<boolean> {
  const sql = `
    DELETE FROM \`items\`
    WHERE \`i_id\` = :id;
  `;

  const result = await execute(sql, { id });

  if (!result) return false;

  return true;
}

export async function unlinkTag(
  itemId: string,
  tagId: string
): Promise<boolean> {
  const sql = `
    DELETE FROM \`itemTags\`
    WHERE \`it_i_id\` = :itemId
      AND \`it_t_id\` = :tagId;
  `;

  const result = await execute(sql, { itemId, tagId });

  if (!result) return false;

  return true;
}

export async function unlinkAssignee(
  itemId: string,
  userId: string
): Promise<boolean> {
  const sql = `
    DELETE FROM \`itemAssignees\`
    WHERE \`ia_i_id\` = :itemId
      AND \`ia_u_id\` = :userId;
  `;

  const result = await execute(sql, { itemId, userId });

  if (!result) return false;

  return true;
}
