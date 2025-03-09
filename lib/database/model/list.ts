import { NamedColor } from '@/lib/model/color';
import List from '@/lib/model/list';
import { DB_ListSection, extractListSectionFromRow } from './listSection';
import { DB_ListMember, extractListMemberFromRow } from './listMember';

export interface DB_List extends DB_ListMember, DB_ListSection {
  l_id: string;
  l_color: NamedColor;
  l_name: string;
  l_hasTimeTracking: boolean;
  l_hasDueDates: boolean;
  l_isAutoOrdered: boolean;
}

export function extractListFromRow(row: DB_List): List {
  const listMember = row.lm_u_id ? [extractListMemberFromRow(row)] : [];

  const listSection = row.ls_name ? [extractListSectionFromRow(row)] : [];

  const list = new List(
    row.l_name,
    row.l_color,
    listMember,
    listSection,
    row.l_hasTimeTracking,
    row.l_hasDueDates,
    row.l_isAutoOrdered,
    row.l_id
  );
  list.id = row.l_id;

  return list;
}
