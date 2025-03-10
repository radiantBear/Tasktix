import ListItem, { Priority, Status } from '@/lib/model/listItem';
import { DB_Assignee, extractAssigneeFromRow } from './assignee';
import { DB_Tag, extractTagFromRow } from './tag';
import Assignee from '@/lib/model/assignee';
import Tag from '@/lib/model/tag';

export interface DB_ListItem extends DB_Assignee, DB_Tag {
  i_id: string;
  i_name: string;
  i_status: Status;
  i_priority: Priority;
  i_isUnclear: boolean;
  i_expectedMs: number | null;
  i_elapsedMs: number;
  i_parentId: string;
  i_ls_id: string;
  i_sectionIndex: number;
  i_dateCreated: Date;
  i_dateDue: Date | null;
  i_dateStarted: Date | null;
  i_dateCompleted: Date | null;
}

export function extractListItemFromRow(row: DB_ListItem): ListItem {
  const assignees = row.ia_role ? [extractAssigneeFromRow(row)] : [];

  const tags = row.t_id ? [extractTagFromRow(row)] : [];

  const listItem = new ListItem(row.i_name, {
    id: row.i_id,
    status: row.i_status,
    priority: row.i_priority,
    isUnclear: row.i_isUnclear,
    expectedMs: row.i_expectedMs,
    elapsedMs: row.i_elapsedMs,
    sectionIndex: row.i_sectionIndex,
    dateCreated: new Date(row.i_dateCreated),
    dateDue: row.i_dateDue ? new Date(row.i_dateDue) : null,
    dateStarted: row.i_dateStarted ? new Date(row.i_dateStarted) : null,
    dateCompleted: row.i_dateCompleted ? new Date(row.i_dateCompleted) : null,
    assignees,
    tags,
    listId: row.l_id,
    sectionId: row.ls_id
  });

  return listItem;
}

export function mergeListItems(original: ListItem[]): ListItem[] {
  const accumulator: ListItem[] = [];

  for (const item of original) {
    if (accumulator.at(-1)?.id == item.id) {
      accumulator.at(-1)?.assignees.push(...item.assignees);
      accumulator
        .at(-1)
        ?.assignees.filter(
          (item: Assignee, index: number, arr: Assignee[]) =>
            arr.indexOf(item) == index
        );
      accumulator.at(-1)?.tags.push(...item.tags);
      accumulator
        .at(-1)
        ?.tags.filter(
          (item: Tag, index: number, arr: Tag[]) => arr.indexOf(item) == index
        );
    } else accumulator.push(item);
  }

  return accumulator;
}
