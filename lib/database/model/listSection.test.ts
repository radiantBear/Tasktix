import { DB_ListSection, extractListSectionFromRow } from './listSection';
import Assignee from '@/lib/model/assignee';
import ListItem from '@/lib/model/listItem';
import ListSection from '@/lib/model/listSection';
import Tag from '@/lib/model/tag';
import User from '@/lib/model/user';

describe('extractListSectionFromRow', () => {
  test('Accurately extracts list section from row data', () => {
    const row: DB_ListSection = {
      ls_id: 'section-id',
      ls_l_id: 'list-id',
      ls_name: 'Test Section',
      i_ls_id: 'section-id',
      i_id: 'item-id',
      i_name: 'test item',
      i_status: 'In Progress',
      i_priority: 'High',
      i_isUnclear: false,
      i_expectedMs: 1000,
      i_elapsedMs: 500,
      i_parentId: '',
      i_sectionIndex: 1,
      i_dateCreated: new Date('2023-02-11 21:53:17'),
      i_dateDue: null,
      i_dateStarted: null,
      i_dateCompleted: null,
      ia_i_id: 'item-id',
      ia_role: 'assignee-role',
      ia_u_id: 'user-id',
      u_id: 'user-id',
      u_username: 'username',
      u_email: 'test@example.com',
      u_password: 'secret',
      u_color: 'Emerald',
      u_dateCreated: new Date('2023-02-11 21:51:01'),
      u_dateSignedIn: new Date('2023-02-11 21:51:01'),
      t_id: 'tag-id',
      t_name: 'tag-name',
      t_color: 'Amber',
      t_i_id: 'item-id',
      constructor: { name: 'RowDataPacket' }
    };

    const section = extractListSectionFromRow(row);

    expect(section).toEqual(
      new ListSection(
        'Test Section',
        [
          new ListItem('test item', {
            id: 'item-id',
            status: 'In Progress',
            priority: 'High',
            isUnclear: false,
            expectedMs: 1000,
            elapsedMs: 500,
            sectionIndex: 1,
            dateCreated: new Date('2023-02-11 21:53:17'),
            dateDue: null,
            dateStarted: null,
            dateCompleted: null,
            assignees: [
              new Assignee(
                new User(
                  'username',
                  'test@example.com',
                  'secret',
                  new Date('2023-02-11 21:51:01'),
                  new Date('2023-02-11 21:51:01'),
                  { id: 'user-id', color: 'Emerald' }
                ),
                'assignee-role'
              )
            ],
            tags: [new Tag('tag-name', 'Amber', 'tag-id')],
            sectionId: 'section-id'
          })
        ],
        'section-id'
      )
    );
  });

  test('Accurately extracts empty list section from row data', () => {
    const row: DB_ListSection = {
      ls_id: 'section-id',
      ls_l_id: 'list-id',
      ls_name: 'Test Section',
      i_ls_id: null,
      i_id: null,
      i_name: null,
      i_status: null,
      i_priority: null,
      i_isUnclear: null,
      i_expectedMs: null,
      i_elapsedMs: null,
      i_parentId: null,
      i_sectionIndex: null,
      i_dateCreated: null,
      i_dateDue: null,
      i_dateStarted: null,
      i_dateCompleted: null,
      constructor: { name: 'RowDataPacket' }
    } as any;

    const section = extractListSectionFromRow(row);

    expect(section).toEqual(new ListSection('Test Section', [], 'section-id'));
  });
});
