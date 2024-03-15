import { generateId } from "../generateId";

export default class User {
  id: string;
  username: string|null;
  email: string|null;
  password: string|null;
  dateCreated: Date|null;
  dateLogin: Date|null;

  constructor(id?: string) {
    if(!id)
      id = generateId();

    this.id = id;
    this.username = null;
    this.email = null;
    this.password = null;
    this.dateCreated = null;
    this.dateLogin = null;
  }
}