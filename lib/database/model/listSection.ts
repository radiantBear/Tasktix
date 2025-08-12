import ListSection from '@/lib/model/listSection';

import { DB_ListItem, extractListItemFromRow } from './listItem';

export interface DB_ListSection extends DB_ListItem {
  ls_id: string;
  ls_l_id: string;
  ls_name: string;
}

export function extractListSectionFromRow(row: DB_ListSection): ListSection {
  const listItem = row.i_id ? [extractListItemFromRow(row)] : [];

  return new ListSection(row.ls_name, listItem, row.ls_id);
}
