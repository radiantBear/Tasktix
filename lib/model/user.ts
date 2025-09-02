import z from 'zod';

import { randomNamedColor } from '../color';
import { generateId } from '../generateId';

import { NamedColor } from './color';

export const ZodUser = z.strictObject({
  id: z.string().length(16),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]*$/),
  email: z.email().max(128),
  password: z.string().min(10).max(128)
});

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
