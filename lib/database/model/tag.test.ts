import { describe } from 'node:test';
import { DB_Tag, extractTagFromRow } from './tag';

describe('extractTagFromRow', () => {
  test('Accurately extracts tag from row data', () => {
    const row: DB_Tag = {
      t_id: 'tag-id',
      t_name: 'Test Tag',
      t_color: 'Blue',
      t_i_id: 'item-id',
      constructor: { name: 'RowDataPacket' }
    };

    const tag = extractTagFromRow(row);

    expect(tag.id).toBe('tag-id');
    expect(tag.name).toBe('Test Tag');
    expect(tag.color).toBe('Blue');
  });
});
