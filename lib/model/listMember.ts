import { DB_ListMember } from '../database/list';
import User, { extractUserFromRow } from './user';

export default class ListMember {
  user: User;
  canAdd: boolean;
  canRemove: boolean;
  canComplete: boolean;
  canAssign: boolean;

  constructor(user: User, canAdd: boolean = false, canRemove: boolean = false, canComplete: boolean = false, canAssign: boolean = false) {
    this.user = user;
    this.canAdd = canAdd;
    this.canRemove = canRemove;
    this.canComplete = canComplete;
    this.canAssign = canAssign;
  }
}

export function extractListMemberFromRow(row: DB_ListMember): ListMember {
  const user = extractUserFromRow(row);
  return new ListMember(user, row.la_canAdd, row.la_canRemove, row.la_canComplete, row.la_canRemove);
}