import { RowDataPacket } from 'mysql2/promise';
import { NamedColor } from '@/lib/model/color';
import Tag from '@/lib/model/tag';

export interface DB_Tag extends RowDataPacket {
  t_id: string;
  t_name: string;
  t_color: NamedColor;
  t_i_id: string;
}

export function extractTagFromRow(row: DB_Tag): Tag {
  return new Tag(row.t_name, row.t_color, row.t_id);
}
