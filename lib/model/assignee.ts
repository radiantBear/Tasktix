import User from './user';

export default class Assignee {
  user: User;
  role: string;

  constructor(user: User, role: string) {
    this.user = user;
    this.role = role;
  }
}
