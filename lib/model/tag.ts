import { DB_Tag } from '../database/listItem';
import { generateId } from '../generateId';
import { NamedColor } from './color';

export default class Tag {
  id: string;
  name: string;
  color: NamedColor;

  constructor(name: string, color: NamedColor, id?: string) {
    if(!id)
      id = generateId();

    this.id = id;
    this.name = name;
    this.color = color;
  }
}

export function extractTagFromRow(row: DB_Tag): Tag {
  return new Tag(row.t_name, row.t_color, row.t_id);
}