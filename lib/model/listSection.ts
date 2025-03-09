import { DB_ListSection } from '../database/listSection';
import { generateId } from '../generateId';
import ListItem, { extractListItemFromRow } from './listItem';

export default class ListSection {
  id: string;
  name: string;
  items: ListItem[];

  constructor(name: string, items: ListItem[], id?: string) {
    if (!id) id = generateId();

    this.id = id;
    this.name = name;
    this.items = items;
  }
}

export function extractListSectionFromRow(row: DB_ListSection): ListSection {
  const listItem = row.i_id ? [extractListItemFromRow(row)] : [];

  return new ListSection(row.ls_name, listItem, row.ls_id);
}
