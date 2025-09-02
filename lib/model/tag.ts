import z from 'zod';

import { generateId } from '../generateId';

import { NamedColor, namedColors } from './color';

export const ZodTag = z.strictObject({
  id: z.string().length(16),
  name: z.string().min(1).max(32),
  color: z.enum(namedColors)
});

export default class Tag {
  id: string;
  name: string;
  color: NamedColor;

  constructor(name: string, color: NamedColor, id?: string) {
    if (!id) id = generateId();

    this.id = id;
    this.name = name;
    this.color = color;
  }
}
