'use server';

import { DB_ListItem } from './listItem';
import ListSection from '../model/listSection';
import { execute } from './db_connect';

export interface DB_ListSection extends DB_ListItem {
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

export async function updateIndices(sectionId: string, itemId: string, index: number, oldIndex: number): Promise<boolean> {
  const sql = `
    UPDATE \`items\`
    SET \`i_sectionIndex\` = CASE 
      WHEN i_id = :itemId 
        THEN :index
        ELSE \`i_sectionIndex\` ${oldIndex > index? '+ 1' : '- 1'}
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
  
  if(!result)
    return false;
  
  return true;
}

export async function deleteListSection(id: string): Promise<boolean> {
  const sql = `
    DELETE FROM \`listSections\`
    WHERE \`ls_id\` = :id;
  `;
  
  const result = await execute(sql, { id });
  
  if(!result)
    return false;
  
  return true;
}