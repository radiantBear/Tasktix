import User, { extractUserFromRow } from './user';
import Color from './color';
import { DB_Assignee } from '../database/listItem';

export default class Assignee {
  user: User;
  role: string;
  color: Color;
  
  constructor(user: User, role: string, color: Color) {
    this.user = user;
    this.role = role;
    this.color = color;
  }
}

export function extractAssigneeFromRow(row: DB_Assignee): Assignee {
  const user = extractUserFromRow(row);
  return new Assignee(user, row.ia_role, row.ia_color);
}