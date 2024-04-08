import Assignee, { extractAssigneeFromRow } from './assignee';
import { generateId } from '@/lib/generateId';
import { DB_ListItem } from '@/lib/database/listItem';
import Tag, { extractTagFromRow } from './tag';

export type Status = 'Unstarted'|'In Progress'|'Paused'|'Completed';
export type Priority = 'Low'|'Medium'|'High';

export default class ListItem {
  id: string;
  name: string;
  status: Status;
  priority: Priority;
  isUnclear: boolean;
  expectedMs: number|null;
  elapsedMs: number;
  dateCreated: Date;
  dateDue: Date|null;
  dateStarted: Date|null;
  dateCompleted: Date|null;
  assignees: Assignee[];
  tags: Tag[];
  listId?: string;
  sectionId?: string;

  constructor(
    name: string, 
    {id, status = 'Unstarted', priority = 'Low', isUnclear = false, expectedMs = null, elapsedMs = 0, dateCreated = new Date(), dateDue = new Date(), dateStarted = null, dateCompleted = null, assignees = [], tags = [], listId, sectionId }:
    {id?: string, status?: Status, priority?: Priority, isUnclear?: boolean, expectedMs?: number|null, elapsedMs?: number, dateCreated?: Date, dateDue?: Date|null, dateStarted?: Date|null, dateCompleted?: Date|null, assignees?: Assignee[], tags?: Tag[], listId?: string, sectionId?: string }
  ) {
    if(!id)
      id = generateId();

    this.id = id;
    this.name = name;
    this.status = status;
    this.priority = priority;
    this.isUnclear = !!isUnclear;
    this.expectedMs = expectedMs;
    this.elapsedMs = elapsedMs;
    this.dateCreated = dateCreated;
    this.dateDue = dateDue;
    this.dateStarted = dateStarted;
    this.dateCompleted = dateCompleted;
    this.assignees = assignees;
    this.tags = tags;
    this.listId = listId;
    this.sectionId = sectionId;
  }
}

export function extractListItemFromRow(row: DB_ListItem): ListItem {
  const assignees = 
    row.ia_role
      ? [extractAssigneeFromRow(row)]
      : [];

  const tags = 
    row.t_id
      ? [extractTagFromRow(row)]
      : [];

  const listItem = new ListItem(
    row.i_name,
    { id: row.i_id,
      status: row.i_status,
      priority: row.i_priority,
      isUnclear: row.i_isUnclear,
      expectedMs: row.i_expectedMs,
      elapsedMs: row.i_elapsedMs,
      dateCreated: new Date(row.i_dateCreated),
      dateDue: row.i_dateDue ? new Date(row.i_dateDue) : null,
      dateStarted: row.i_dateStarted ? new Date(row.i_dateStarted) : null,
      dateCompleted: row.i_dateCompleted ? new Date(row.i_dateCompleted) : null,
      assignees,
      tags,
      listId: row.l_id,
      sectionId: row.ls_id
    }
  );

  return listItem;
}

export function mergeListItems(original: ListItem[]): ListItem[] {
  const accumulator: ListItem[] = [];

  for(const item of original) {
    if(accumulator.at(-1)?.id == item.id) {
      accumulator.at(-1)?.assignees.push(...item.assignees);
      accumulator.at(-1)?.assignees.filter((item: Assignee, index: number, arr: Assignee[]) => arr.indexOf(item) == index);
      accumulator.at(-1)?.tags.push(...item.tags);
      accumulator.at(-1)?.tags.filter((item: Tag, index: number, arr: Tag[]) => arr.indexOf(item) == index);
    }
    else
      accumulator.push(item);
  }

  return accumulator;
}