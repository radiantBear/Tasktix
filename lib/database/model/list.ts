import { RowDataPacket } from 'mysql2';
import { NamedColor } from '@/lib/model/color';
import List from '@/lib/model/list';
import { DB_ListSection, extractListSectionFromRow } from './listSection';
import { DB_ListMember, extractListMemberFromRow } from './listMember';
import { extractListItemFromRow } from './listItem';

export interface DB_BareList extends RowDataPacket {
  l_id: string;
  l_color: NamedColor;
  l_name: string;
  l_hasTimeTracking: boolean;
  l_hasDueDates: boolean;
  l_isAutoOrdered: boolean;
}
export interface DB_List extends DB_BareList, DB_ListMember, DB_ListSection {}

export function extractBareListFromRow(row: DB_BareList): List {
  const list = new List(
    row.l_name,
    row.l_color,
    [],
    [],
    row.l_hasTimeTracking,
    row.l_hasDueDates,
    row.l_isAutoOrdered,
    row.l_id
  );
  list.id = row.l_id;

  return list;
}

export function extractListFromRow(row: DB_List): List {
  const listMember = [extractListMemberFromRow(row)];

  const listSection = [extractListSectionFromRow(row)];

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

// Expects lists to be sorted by list ID, then list member user ID and list section ID
export function extractListsFromRows(rows: DB_List[]): List[] {
  const lists: List[] = [];

  for (const list of rows) {
    const last = lists.at(-1);

    if (last?.id == list.l_id) {
      if (last?.members.at(-1)?.user.id != list.lm_u_id)
        last?.members.push(extractListMemberFromRow(list));

      if (last?.sections.at(-1)?.id != list.ls_id)
        last?.sections.push(extractListSectionFromRow(list));
      else if (last?.sections.at(-1)?.items.at(-1)?.id != list.i_id)
        last.sections.at(-1)?.items.push(extractListItemFromRow(list));
    } else {
      lists.push(extractListFromRow(list));
    }
  }

  return lists;
}
