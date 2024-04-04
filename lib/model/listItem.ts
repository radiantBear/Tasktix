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
  expectedDuration: Date;
  elapsedDuration: Date;
  dateCreated: Date;
  dateDue: Date;
  dateStarted: Date|null;
  assignees: Assignee[];
  tags: Tag[];

  constructor(
    name: string, expectedDuration: Date, 
    {id, status = 'Unstarted', priority = 'Low', isUnclear = false, elapsedDuration = new Date(0), dateCreated = new Date(), dateDue = new Date(), dateStarted = null, assignees = [], tags = []}: 
    {id?: string, status?: Status, priority?: Priority, isUnclear?: boolean, elapsedDuration?: Date, dateCreated?: Date, dateDue?: Date, dateStarted?: Date|null, assignees?: Assignee[], tags?: Tag[]}
  ) {
    if(!id)
      id = generateId();

    this.id = id;
    this.name = name;
    this.status = status;
    this.priority = priority;
    this.isUnclear = !!isUnclear;
    this.expectedDuration = expectedDuration;
    this.elapsedDuration = elapsedDuration;
    this.dateCreated = dateCreated;
    this.dateDue = dateDue;
    this.dateStarted = dateStarted;
    this.assignees = assignees;
    this.tags = tags;
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
    new Date(row.i_expectedDuration),
    { id: row.i_id,
      status: row.i_status,
      priority: row.i_priority,
      isUnclear: row.i_isUnclear,
      elapsedDuration: new Date(row.i_elapsedDuration),
      dateCreated: new Date(row.i_dateCreated),
      dateDue: new Date(row.i_dateDue),
      dateStarted: row.i_dateStarted ? new Date(row.i_dateStarted) : null,
      assignees,
      tags 
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