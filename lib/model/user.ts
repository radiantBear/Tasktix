import { randomColor } from "../color";
import { DB_User } from "../database/user";
import { generateId } from "../generateId";
import Color from "./color";

export default class User {
  id: string;
  username: string;
  email: string;
  password: string;
  color: Color;
  dateCreated: Date;
  dateSignedIn: Date;

  constructor(username: string, email: string, password: string, dateCreated: Date, dateSignedIn: Date, { id, color }: { id?: string, color?: Color }) {
    if(!id)
      id = generateId();

    if(!color)
      color = randomColor();

    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.color = color;
    this.dateCreated = dateCreated;
    this.dateSignedIn = dateSignedIn;
  }
}

export function extractUserFromRow(row: DB_User): User {
  const user = new User(
    row.u_username,
    row.u_email,
    row.u_password,
    new Date(row.u_dateCreated),
    new Date(row.u_dateSignedIn),
    {
      id: row.u_id,
      color: row.u_color
    }
  );

  return user;
}