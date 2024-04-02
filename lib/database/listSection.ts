'use server';

import { RowDataPacket } from 'mysql2';
import ListSection from '../model/listSection';
import { execute } from './db_connect';

export interface DB_ListSection extends RowDataPacket {
  ls_id: string;
  ls_l_id: string;
  ls_name: string;
}

export async function createListSection(listId: string, listSection: ListSection): Promise<boolean> {
  const sql = `
    INSERT INTO \`listSections\`(
      \`ls_id\`,
      \`ls_l_id\`,
      \`ls_name\`
    )
    VALUES (:id, :listId, :name);
  `;
  
  const result = await execute(sql, { listId, ...listSection });
  
  if(!result)
    return false;
  
  return true;
}