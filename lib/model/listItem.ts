import Assignee from './assignee';
import { generateId } from '@/lib/generateId';
import Tag from './tag';

export type Status = 'Unstarted' | 'In Progress' | 'Paused' | 'Completed';
export type Priority = 'Low' | 'Medium' | 'High';

export default class ListItem {
  id: string;
  name: string;
  status: Status;
  priority: Priority;
  isUnclear: boolean;
  expectedMs: number | null;
  elapsedMs: number;
  sectionIndex: number;
  dateCreated: Date;
  dateDue: Date | null;
  dateStarted: Date | null;
  dateCompleted: Date | null;
  assignees: Assignee[];
  tags: Tag[];
  listId?: string;
  sectionId?: string;

  constructor(
    name: string,
    {
      id,
      status = 'Unstarted',
      priority = 'Low',
      isUnclear = false,
      expectedMs = null,
      elapsedMs = 0,
      sectionIndex = 0,
      dateCreated = new Date(),
      dateDue = new Date(),
      dateStarted = null,
      dateCompleted = null,
      assignees = [],
      tags = [],
      listId,
      sectionId
    }: {
      id?: string;
      status?: Status;
      priority?: Priority;
      isUnclear?: boolean;
      expectedMs?: number | null;
      elapsedMs?: number;
      sectionIndex?: number;
      dateCreated?: Date;
      dateDue?: Date | null;
      dateStarted?: Date | null;
      dateCompleted?: Date | null;
      assignees?: Assignee[];
      tags?: Tag[];
      listId?: string;
      sectionId?: string;
    }
  ) {
    if (!id) id = generateId();

    this.id = id;
    this.name = name;
    this.status = status;
    this.priority = priority;
    this.isUnclear = !!isUnclear;
    this.expectedMs = expectedMs;
    this.elapsedMs = elapsedMs;
    this.sectionIndex = sectionIndex;
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
