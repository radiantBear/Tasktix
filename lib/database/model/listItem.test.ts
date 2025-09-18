/**
 * Tasktix: A powerful and flexible task-tracking tool for all.
 * Copyright (C) 2025 Nate Baird & other Tasktix contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Assignee from '@/lib/model/assignee';
import ListItem from '@/lib/model/listItem';
import Tag from '@/lib/model/tag';
import User from '@/lib/model/user';

import {
  DB_ListItem,
  extractListItemFromRow,
  extractListItemsFromRows
} from './listItem';

describe('extractListItemFromRow', () => {
  test('Accurately extracts bare list item data', () => {
    const row: DB_ListItem = {
      i_id: 'item-id',
      i_name: 'test item',
      i_status: 'Completed',
      i_priority: 'High',
      i_isUnclear: false,
      i_expectedMs: 1000,
      i_elapsedMs: 500,
      i_parentId: '',
      i_sectionIndex: 1,
      i_dateCreated: new Date('2023-02-11 21:53:17'),
      i_dateDue: new Date('2023-02-14 00:00:00'),
      i_dateStarted: new Date('2023-02-12 09:03:51'),
      i_dateCompleted: new Date('2023-02-12 09:03:52'),
      constructor: { name: 'RowDataPacket' }
    } as never;

    const listItem = extractListItemFromRow(row);

    expect(listItem.id).toBe('item-id');
    expect(listItem.name).toBe('test item');
    expect(listItem.status).toBe('Completed');
    expect(listItem.priority).toBe('High');
    expect(listItem.isUnclear).toBe(false);
    expect(listItem.expectedMs).toBe(1000);
    expect(listItem.elapsedMs).toBe(500);
    expect(listItem.sectionIndex).toBe(1);
    expect(listItem.dateCreated).toStrictEqual(new Date('2023-02-11 21:53:17'));
    expect(listItem.dateDue).toStrictEqual(new Date('2023-02-14 00:00:00'));
    expect(listItem.dateStarted).toStrictEqual(new Date('2023-02-12 09:03:51'));
    expect(listItem.dateCompleted).toStrictEqual(
      new Date('2023-02-12 09:03:52')
    );
    expect(listItem.assignees).toHaveLength(0);
    expect(listItem.tags).toHaveLength(0);
  });

  test('Accurately extracts bare list item data with nullable fields empty', () => {
    const row: DB_ListItem = {
      i_id: 'item-id',
      i_name: 'test item',
      i_status: 'Completed',
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
      constructor: { name: 'RowDataPacket' }
    } as never;

    const listItem = extractListItemFromRow(row);

    expect(listItem.id).toBe('item-id');
    expect(listItem.name).toBe('test item');
    expect(listItem.status).toBe('Completed');
    expect(listItem.priority).toBe('High');
    expect(listItem.isUnclear).toBe(false);
    expect(listItem.expectedMs).toBe(1000);
    expect(listItem.elapsedMs).toBe(500);
    expect(listItem.sectionIndex).toBe(1);
    expect(listItem.dateCreated).toStrictEqual(new Date('2023-02-11 21:53:17'));
    expect(listItem.dateDue).toBeNull();
    expect(listItem.dateStarted).toBeNull();
    expect(listItem.dateCompleted).toBeNull();
    expect(listItem.assignees).toHaveLength(0);
    expect(listItem.tags).toHaveLength(0);
  });

  test('Accurately extracts enriched list item data', () => {
    const row: DB_ListItem = {
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

    const listItem = extractListItemFromRow(row);

    expect(listItem).toEqual(
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
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      })
    );
  });
});

describe('extractListItemsFromRows', () => {
  test('Accurately aggregates sequential assignees into assignees array', () => {
    const rows: DB_ListItem[] = [
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
        i_dateCompleted: null,
        ia_i_id: 'item-id',
        ia_role: 'assignee-role',
        ia_u_id: 'user-id-1',
        u_id: 'user-id-1',
        u_username: 'username1',
        u_email: 'test1@example.com',
        u_password: 'secret1',
        u_color: 'Emerald',
        u_dateCreated: new Date('2023-02-11 21:51:01'),
        u_dateSignedIn: new Date('2023-02-11 21:51:01'),
        t_id: 'tag-id',
        t_name: 'tag-name',
        t_color: 'Amber',
        t_i_id: 'item-id',
        constructor: { name: 'RowDataPacket' }
      },
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
        i_dateCompleted: null,
        ia_i_id: 'item-id',
        ia_role: 'assignee-2-role',
        ia_u_id: 'user-id-2',
        u_id: 'user-id-2',
        u_username: 'username2',
        u_email: 'test2@example.com',
        u_password: 'secret2',
        u_color: 'Green',
        u_dateCreated: new Date('2023-02-14 21:51:01'),
        u_dateSignedIn: new Date('2023-02-14 21:51:01'),
        t_id: 'tag-id',
        t_name: 'tag-name',
        t_color: 'Amber',
        t_i_id: 'item-id',
        constructor: { name: 'RowDataPacket' }
      }
    ];

    const listItems = extractListItemsFromRows(rows);

    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toEqual(
      new ListItem('test item', {
        id: 'item-id',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [
          new Assignee(
            new User(
              'username1',
              'test1@example.com',
              'secret1',
              new Date('2023-02-11 21:51:01'),
              new Date('2023-02-11 21:51:01'),
              { id: 'user-id-1', color: 'Emerald' }
            ),
            'assignee-role'
          ),
          new Assignee(
            new User(
              'username2',
              'test2@example.com',
              'secret2',
              new Date('2023-02-14 21:51:01'),
              new Date('2023-02-14 21:51:01'),
              { id: 'user-id-2', color: 'Green' }
            ),
            'assignee-2-role'
          )
        ],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      })
    );
  });

  test('Accurately aggregates sequential tags into tags array', () => {
    const rows: DB_ListItem[] = [
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
        i_dateCompleted: null,
        ia_i_id: 'item-id',
        ia_role: 'assignee-role',
        ia_u_id: 'user-id-1',
        u_id: 'user-id-1',
        u_username: 'username1',
        u_email: 'test1@example.com',
        u_password: 'secret1',
        u_color: 'Emerald',
        u_dateCreated: new Date('2023-02-11 21:51:01'),
        u_dateSignedIn: new Date('2023-02-11 21:51:01'),
        t_id: 'tag-id',
        t_name: 'tag-name',
        t_color: 'Amber',
        t_i_id: 'item-id',
        constructor: { name: 'RowDataPacket' }
      },
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
        i_dateCompleted: null,
        ia_i_id: 'item-id',
        ia_role: 'assignee-role',
        ia_u_id: 'user-id-1',
        u_id: 'user-id-1',
        u_username: 'username1',
        u_email: 'test1@example.com',
        u_password: 'secret1',
        u_color: 'Emerald',
        u_dateCreated: new Date('2023-02-11 21:51:01'),
        u_dateSignedIn: new Date('2023-02-11 21:51:01'),
        t_id: 'tag-id-2',
        t_name: 'tag-name-2',
        t_color: 'Blue',
        t_i_id: 'item-id',
        constructor: { name: 'RowDataPacket' }
      }
    ];

    const listItems = extractListItemsFromRows(rows);

    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toEqual(
      new ListItem('test item', {
        id: 'item-id',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [
          new Assignee(
            new User(
              'username1',
              'test1@example.com',
              'secret1',
              new Date('2023-02-11 21:51:01'),
              new Date('2023-02-11 21:51:01'),
              { id: 'user-id-1', color: 'Emerald' }
            ),
            'assignee-role'
          )
        ],
        tags: [
          new Tag('tag-name', 'Amber', 'tag-id'),
          new Tag('tag-name-2', 'Blue', 'tag-id-2')
        ]
      })
    );
  });

  test('Accurately aggregates sequential list items into an array', () => {
    const rows: DB_ListItem[] = [
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
      },
      {
        i_ls_id: 'section-id',
        i_id: 'item-id-2',
        i_name: 'test item 2',
        i_status: 'Unstarted',
        i_priority: 'High',
        i_isUnclear: false,
        i_expectedMs: 1500,
        i_elapsedMs: 0,
        i_parentId: '',
        i_sectionIndex: 1,
        i_dateCreated: new Date('2023-02-15 21:53:17'),
        i_dateDue: new Date('2023-02-15 00:00:00'),
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
      }
    ];

    const listItems = extractListItemsFromRows(rows);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(listItems).toHaveLength(2);
    expect(listItems).toEqual([
      new ListItem('test item', {
        id: 'item-id',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      }),
      new ListItem('test item 2', {
        id: 'item-id-2',
        status: 'Unstarted',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1500,
        elapsedMs: 0,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-15 21:53:17'),
        dateDue: new Date('2023-02-15 00:00:00'),
        dateStarted: null,
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      })
    ]);
  });

  test('Works even if the first record has no assignees', () => {
    const rows: DB_ListItem[] = [
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
        i_dateCompleted: null,
        ia_i_id: null,
        ia_role: null,
        ia_u_id: null,
        u_id: null,
        u_username: null,
        u_email: null,
        u_password: null,
        u_color: null,
        u_dateCreated: null,
        u_dateSignedIn: null,
        t_id: 'tag-id',
        t_name: 'tag-name',
        t_color: 'Amber',
        t_i_id: 'item-id',
        constructor: { name: 'RowDataPacket' }
      } as never,
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
      },
      {
        i_ls_id: 'section-id',
        i_id: 'item-id-2',
        i_name: 'test item 2',
        i_status: 'In Progress',
        i_priority: 'High',
        i_isUnclear: false,
        i_expectedMs: 1000,
        i_elapsedMs: 500,
        i_parentId: '',
        i_sectionIndex: 1,
        i_dateCreated: new Date('2023-02-11 21:53:17'),
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
      }
    ];

    const listItems = extractListItemsFromRows(rows);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(listItems).toHaveLength(2);
    expect(listItems).toEqual([
      new ListItem('test item', {
        id: 'item-id',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      }),
      new ListItem('test item 2', {
        id: 'item-id-2',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      })
    ]);
  });

  test('Works even if the first list item has no assignees', () => {
    const rows: DB_ListItem[] = [
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
        i_dateCompleted: null,
        ia_i_id: null,
        ia_role: null,
        ia_u_id: null,
        u_id: null,
        u_username: null,
        u_email: null,
        u_password: null,
        u_color: null,
        u_dateCreated: null,
        u_dateSignedIn: null,
        t_id: 'tag-id',
        t_name: 'tag-name',
        t_color: 'Amber',
        t_i_id: 'item-id',
        constructor: { name: 'RowDataPacket' }
      } as never,
      {
        i_ls_id: 'section-id',
        i_id: 'item-id-2',
        i_name: 'test item 2',
        i_status: 'In Progress',
        i_priority: 'High',
        i_isUnclear: false,
        i_expectedMs: 1000,
        i_elapsedMs: 500,
        i_parentId: '',
        i_sectionIndex: 1,
        i_dateCreated: new Date('2023-02-11 21:53:17'),
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
      }
    ];

    const listItems = extractListItemsFromRows(rows);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(listItems).toHaveLength(2);
    expect(listItems).toEqual([
      new ListItem('test item', {
        id: 'item-id',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      }),
      new ListItem('test item 2', {
        id: 'item-id-2',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      })
    ]);
  });

  test('Works even if the first record has no tags', () => {
    const rows: DB_ListItem[] = [
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
        t_id: null,
        t_name: null,
        t_color: null,
        t_i_id: null,
        constructor: { name: 'RowDataPacket' }
      } as never,
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
      },
      {
        i_ls_id: 'section-id',
        i_id: 'item-id-2',
        i_name: 'test item 2',
        i_status: 'In Progress',
        i_priority: 'High',
        i_isUnclear: false,
        i_expectedMs: 1000,
        i_elapsedMs: 500,
        i_parentId: '',
        i_sectionIndex: 1,
        i_dateCreated: new Date('2023-02-11 21:53:17'),
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
      }
    ];

    const lists = extractListItemsFromRows(rows);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(lists).toHaveLength(2);
    expect(lists).toEqual([
      new ListItem('test item', {
        id: 'item-id',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      }),
      new ListItem('test item 2', {
        id: 'item-id-2',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      })
    ]);
  });

  test('Works even if the first list item has no tags', () => {
    const rows: DB_ListItem[] = [
      {
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
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
        t_id: null,
        t_name: null,
        t_color: null,
        t_i_id: null,
        constructor: { name: 'RowDataPacket' }
      } as never,
      {
        i_ls_id: 'section-id',
        i_id: 'item-id-2',
        i_name: 'test item 2',
        i_status: 'In Progress',
        i_priority: 'High',
        i_isUnclear: false,
        i_expectedMs: 1000,
        i_elapsedMs: 500,
        i_parentId: '',
        i_sectionIndex: 1,
        i_dateCreated: new Date('2023-02-11 21:53:17'),
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
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
      }
    ];

    const lists = extractListItemsFromRows(rows);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(lists).toHaveLength(2);
    expect(lists).toEqual([
      new ListItem('test item', {
        id: 'item-id',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: []
      }),
      new ListItem('test item 2', {
        id: 'item-id-2',
        status: 'In Progress',
        priority: 'High',
        isUnclear: false,
        expectedMs: 1000,
        elapsedMs: 500,
        sectionIndex: 1,
        dateCreated: new Date('2023-02-11 21:53:17'),
        dateDue: new Date('2023-02-14 00:00:00'),
        dateStarted: new Date('2023-02-12 09:03:51'),
        dateCompleted: null,
        assignees: [new Assignee(user, 'assignee-role')],
        tags: [new Tag('tag-name', 'Amber', 'tag-id')]
      })
    ]);
  });

  test('Returns an empty array when given no rows', () => {
    const lists = extractListItemsFromRows([]);

    expect(lists).toHaveLength(0);
  });
});
