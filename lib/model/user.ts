import { DB_User } from "../database/user";
import { generateId } from "../generateId";

export default class User {
  id: string;
  username: string|null;
  email: string|null;
  password: string|null;
  dateCreated: Date|null;
  dateSignedIn: Date|null;

  constructor(id?: string) {
    if(!id)
      id = generateId();

    this.id = id;
    this.username = null;
    this.email = null;
    this.password = null;
    this.dateCreated = null;
    this.dateSignedIn = null;
  }
}

export function extractUserFromRow(row: DB_User): User {
  const user = new User(row.u_id);
  user.username = row.u_username;
  user.email = row.u_email;
  user.password = row.u_password;
  user.dateCreated = new Date(row.u_dateCreated);
  
  if(row.u_dateSignedIn)
    user.dateSignedIn = new Date(row.u_dateSignedIn);

  return user;
}