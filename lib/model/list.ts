import ListMember, { extractListMemberFromRow } from './listMember';
import { generateId } from '@/lib/generateId';
import { DB_List } from '@/lib/database/list';
import { mergeListItems } from './listItem';
import ListSection, { extractListSectionFromRow } from './listSection';
import { NamedColor } from './color';

export default class List {
  id: string;
  name: string;
  color: NamedColor;
  hasTimeTracking: boolean;
  hasDueDates: boolean;
  isAutoOrdered: boolean;
  members: ListMember[];
  sections: ListSection[];

  constructor(
    name: string,
    color: NamedColor,
    members: ListMember[],
    sections: ListSection[],
    hasTimeTracking: boolean,
    hasDueDates: boolean,
    isAutoOrdered: boolean,
    id?: string
  ) {
    if (!id) id = generateId();

    this.id = id;
    this.name = name;
    this.color = color;
    this.hasTimeTracking = hasTimeTracking;
    this.hasDueDates = hasDueDates;
    this.isAutoOrdered = isAutoOrdered;
    this.members = members;
    this.sections = sections;
  }
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

export function mergeLists(original: List[]): List[] {
  const accumulator: List[] = [];

  for (const current of original) {
    const last = accumulator.at(-1);

    if (last?.id == current.id) {
      // Merge new data into list

      // Add any new members
      last?.members.push(...current.members);
      if (last)
        last.members = last.members.filter(
          (item: ListMember, index: number, arr: ListMember[]) =>
            arr.findIndex(_item => _item.user.id == item.user.id) == index
        );

      const lastSection = last?.sections.at(-1);
      if (lastSection && lastSection?.id == current.sections.at(0)?.id) {
        // Merge new data into list section
        lastSection.items = mergeListItems([
          ...(lastSection?.items || []),
          ...(current.sections.at(0)?.items || [])
        ]);
      }
      // Add new list section
      else last?.sections.push(...current.sections);
    }
    // Add new list
    else accumulator.push(current);
  }

  return accumulator;
}
