import Assignee, { extractAssigneeFromRow } from './assignee';
import { generateId } from '../generateId';
import { DB_ListItem } from '../database/listItem';

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

  constructor(
    name: string, expectedDuration: Date, 
    {id, status = 'Unstarted', priority = 'Low', isUnclear = false, elapsedDuration = new Date(0), dateCreated = new Date(), dateDue = new Date(), dateStarted = null, assignees = []}: 
    {id?: string, status?: Status, priority?: Priority, isUnclear?: boolean, elapsedDuration?: Date, dateCreated?: Date, dateDue?: Date, dateStarted?: Date|null, assignees?: Assignee[]}
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
  }
}

export function extractListItemFromRow(row: DB_ListItem): ListItem {
  const assignees = 
    row.ia_role
      ? [extractAssigneeFromRow(row)]
      : [];

  const list = new ListItem(row.i_name, row.i_expectedDuration, { id: row.i_id, status: row.i_status, priority: row.i_priority, isUnclear: row.i_isUnclear, elapsedDuration: row.i_elapsedDuration, dateCreated: row.i_dateCreated, dateDue: row.i_dateDue, dateStarted: row.i_dateStarted, assignees });
  list.id = row.l_id;

  return list;
}