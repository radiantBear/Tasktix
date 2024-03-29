import Tag from './tag';
import Assignee from './assignee';

export default interface Item {
  id: string;
  name: string;
  status: 'Unstarted'|'In Progress'|'Paused'|'Completed';
  priority: 'High'|'Medium'|'Low';
  needsClarification: boolean;
  tags: Tag[];
  expectedDuration: Date;
  elapsedDuration: Date;
  dateDue: Date;
  assignees: Assignee[];
}