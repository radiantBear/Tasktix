'use server';

import { DB_User } from './user';
import { execute } from './db_connect';
import ListItem, { Priority, Status } from '@/lib/model/listItem';
import Color from '@/lib/model/color';
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
  i_expectedDuration: Date;
  i_elapsedDuration: Date;
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