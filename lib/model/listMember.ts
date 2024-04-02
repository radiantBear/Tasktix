import User from './user';

export default interface ListMember {
  user: User,
  canAdd: boolean,
  canRemove: boolean,
  canComplete: boolean,
  canAssign: boolean,
}

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