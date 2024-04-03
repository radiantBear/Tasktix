import { DB_Tag } from '../database/listItem';
import { generateId } from '../generateId';
import Color from './color';

export default class Tag {
  id: string;
  name: string;
  color: Color;

  constructor(name: string, color: Color, id?: string) {
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