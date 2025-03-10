import { NamedColor } from '@/lib/model/color';
import List from '@/lib/model/list';
import { DB_ListSection, extractListSectionFromRow } from './listSection';
import { DB_ListMember, extractListMemberFromRow } from './listMember';
import { extractListItemFromRow } from './listItem';

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

// Expects lists to be sorted by list ID, then list member user ID and list section ID
export function extractListsFromRows(rows: DB_List[]): List[] {
  const lists: List[] = [];

  for (const current of rows) {
    const last = lists.at(-1);

    if (last?.id == current.id) {
      if (last?.members.at(-1)?.user.id != current.lm_u_id)
        last?.members.push(extractListMemberFromRow(current));

      if (last?.sections.at(-1)?.id != current.ls_id)
        last?.sections.push(extractListSectionFromRow(current));
      else if (last?.sections.at(-1)?.items.at(-1)?.id != current.i_id)
        last.sections.at(-1)?.items.push(extractListItemFromRow(current));
    } else {
      lists.push(extractListFromRow(current));
    }
  }

  return lists;
}
