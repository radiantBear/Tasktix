'use server';

import { DB_ListItem, extractListItemFromRow } from './listItem';
import ListSection from '../model/listSection';
import { execute } from './db_connect';

export interface DB_ListSection extends DB_ListItem {
  ls_id: string;
  ls_l_id: string;
  ls_name: string;
}

export function extractListSectionFromRow(row: DB_ListSection): ListSection {
  const listItem = row.i_id ? [extractListItemFromRow(row)] : [];

  return new ListSection(row.ls_name, listItem, row.ls_id);
}

export async function createListSection(
  listId: string,
  listSection: ListSection
): Promise<boolean> {
  const sql = `
    INSERT INTO \`listSections\`(
      \`ls_id\`,
      \`ls_l_id\`,
      \`ls_name\`
    )
    VALUES (:id, :listId, :name);
  `;

  const result = await execute(sql, { listId, ...listSection });

  if (!result) return false;

  return true;
}

export async function updateListSection(
  id: string,
  name: string
): Promise<boolean> {
  const sql = `
    UPDATE \`listSections\`
    SET \`ls_name\` = name
    WHERE \`ls_id\` = :id;
  `;

  const result = await execute(sql, { id, name });

  if (!result) return false;

  return true;
}

export async function deleteListSection(id: string): Promise<boolean> {
  const sql = `
    DELETE FROM \`listSections\`
    WHERE \`ls_id\` = :id;
  `;

  const result = await execute(sql, { id });

  if (!result) return false;

  return true;
}
