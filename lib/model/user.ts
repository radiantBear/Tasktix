import { randomNamedColor } from '../color';
import { generateId } from '../generateId';
import { NamedColor } from './color';

export default class User {
  id: string;
  username: string;
  email: string;
  password: string;
  color: NamedColor;
  dateCreated: Date;
  dateSignedIn: Date;

  constructor(
    username: string,
    email: string,
    password: string,
    dateCreated: Date,
    dateSignedIn: Date,
    { id, color }: { id?: string; color?: NamedColor }
  ) {
    if (!id) id = generateId();

    if (!color) color = randomNamedColor();

    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.color = color;
    this.dateCreated = dateCreated;
    this.dateSignedIn = dateSignedIn;
  }
}
