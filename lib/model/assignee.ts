import User, { extractUserFromRow } from './user';
import { DB_Assignee } from '../database/listItem';

export default class Assignee {
  user: User;
  role: string;
  
  constructor(user: User, role: string) {
    this.user = user;
    this.role = role;
  }
}

export function extractAssigneeFromRow(row: DB_Assignee): Assignee {
  const user = extractUserFromRow(row);
  return new Assignee(user, row.ia_role);
}