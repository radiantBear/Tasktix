import { DB_List, extractListFromRow, extractListsFromRows } from './list';
import Assignee from '@/lib/model/assignee';
import List from '@/lib/model/list';
import ListItem from '@/lib/model/listItem';
import ListMember from '@/lib/model/listMember';
import ListSection from '@/lib/model/listSection';
import Tag from '@/lib/model/tag';
import User from '@/lib/model/user';

describe('extractListFromRow', () => {
  test('Accurately extracts bare list data', () => {
    const row: DB_List = {
      l_id: 'list-id',
      l_color: 'Amber',
      l_name: 'list-name',
      l_hasTimeTracking: true,
      l_hasDueDates: true,
      l_isAutoOrdered: true,
      constructor: { name: 'RowDataPacket' }
    } as any;

    const list = extractListFromRow(row);

    expect(list.id).toBe('list-id');
    expect(list.color).toBe('Amber');
    expect(list.name).toBe('list-name');
    expect(list.hasTimeTracking).toBe(true);
    expect(list.hasDueDates).toBe(true);
    expect(list.isAutoOrdered).toBe(true);
    expect(list.members).toHaveLength(0);
    expect(list.sections).toHaveLength(0);
  });

  test('Accurately extracts enriched list data', () => {
    const row: DB_List = {
      l_id: 'list-id',
      l_color: 'Amber',
      l_name: 'test list',
      l_hasTimeTracking: true,
      l_hasDueDates: true,
      l_isAutoOrdered: true,
      lm_l_id: 'list-id',
      lm_u_id: 'user-id',
      lm_canAdd: true,
      lm_canRemove: true,
      lm_canComplete: true,
      lm_canAssign: true,
      ls_id: 'section-id',
      ls_l_id: 'list-id',
      ls_name: 'test section',
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
    };

    const list = extractListFromRow(row);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(list).toEqual(
      new List(
        'test list',
        'Amber',
        [new ListMember(user, true, true, true, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        true,
        true,
        'list-id'
      )
    );
  });
});

describe('extractListsFromRows', () => {
  test('Accurately aggregates sequential list members into members array', () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id-1',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id-2',
        lm_canAdd: true,
        lm_canRemove: false,
        lm_canComplete: true,
        lm_canAssign: false,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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

    const lists = extractListsFromRows(rows);

    const user1 = new User(
      'username1',
      'test1@example.com',
      'secret1',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id-1', color: 'Emerald' }
    );
    const user2 = new User(
      'username2',
      'test2@example.com',
      'secret2',
      new Date('2023-02-14 21:51:01'),
      new Date('2023-02-14 21:51:01'),
      { id: 'user-id-2', color: 'Green' }
    );

    expect(lists).toHaveLength(1);
    expect(lists[0]).toEqual(
      new List(
        'test list',
        'Amber',
        [
          new ListMember(user1, true, true, true, true),
          new ListMember(user2, true, false, true, false)
        ],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user1, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        true,
        true,
        'list-id'
      )
    );
  });

  test('Accurately aggregates sequential list sections into sections array', () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id-1',
        ls_l_id: 'list-id',
        ls_name: 'test section 1',
        i_ls_id: 'section-id-1',
        i_id: 'item-id',
        i_name: 'test item',
        i_status: 'In Progress',
        i_priority: 'High',
        i_isUnclear: true,
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
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id-2',
        ls_l_id: 'list-id',
        ls_name: 'test section 2',
        i_ls_id: 'section-id-2',
        i_id: 'item-id-2',
        i_name: 'test item 2',
        i_status: 'Completed',
        i_priority: 'Low',
        i_isUnclear: false,
        i_expectedMs: 100000,
        i_elapsedMs: 73000,
        i_parentId: '',
        i_sectionIndex: 2,
        i_dateCreated: new Date('2023-02-11 21:53:17'),
        i_dateDue: new Date('2023-02-13 00:00:00'),
        i_dateStarted: new Date('2023-02-12 12:03:51'),
        i_dateCompleted: new Date('2023-02-12 12:32:21'),
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
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id-3',
        ls_l_id: 'list-id',
        ls_name: 'test section 3',
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
        ia_i_id: null,
        ia_role: null,
        ia_u_id: null,
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
      } as any
    ];

    const list = extractListsFromRows(rows);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(
      new List(
        'test list',
        'Amber',
        [new ListMember(user, true, true, true, true)],
        [
          new ListSection(
            'test section 1',
            [
              new ListItem('test item', {
                id: 'item-id',
                status: 'In Progress',
                priority: 'High',
                isUnclear: true,
                expectedMs: 1000,
                elapsedMs: 500,
                sectionIndex: 1,
                dateCreated: new Date('2023-02-11 21:53:17'),
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id-1'
              })
            ],
            'section-id-1'
          ),
          new ListSection(
            'test section 2',
            [
              new ListItem('test item 2', {
                id: 'item-id-2',
                status: 'Completed',
                priority: 'Low',
                isUnclear: false,
                expectedMs: 100000,
                elapsedMs: 73000,
                sectionIndex: 2,
                dateCreated: new Date('2023-02-11 21:53:17'),
                dateDue: new Date('2023-02-13 00:00:00'),
                dateStarted: new Date('2023-02-12 12:03:51'),
                dateCompleted: new Date('2023-02-12 12:32:21'),
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id-2'
              })
            ],
            'section-id-2'
          ),
          new ListSection('test section 3', [], 'section-id-3')
        ],
        true,
        true,
        true,
        'list-id'
      )
    );
  });

  test("Accurately aggregates sequential list items into their sections' arrays", () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
        i_ls_id: 'section-id',
        i_id: 'item-id-2',
        i_name: 'test item 2',
        i_status: 'Completed',
        i_priority: 'Low',
        i_isUnclear: false,
        i_expectedMs: 100,
        i_elapsedMs: 120,
        i_parentId: '',
        i_sectionIndex: 2,
        i_dateCreated: new Date('2023-02-11 21:52:58'),
        i_dateDue: new Date('2023-02-14 00:00:00'),
        i_dateStarted: new Date('2023-02-12 09:03:51'),
        i_dateCompleted: new Date('2023-02-12 08:53:52'),
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
      } as any
    ];

    const lists = extractListsFromRows(rows);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );

    expect(lists).toHaveLength(1);
    expect(lists[0]).toEqual(
      new List(
        'test list',
        'Amber',
        [new ListMember(user, true, true, true, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
              }),
              new ListItem('test item 2', {
                id: 'item-id-2',
                status: 'Completed',
                priority: 'Low',
                isUnclear: false,
                expectedMs: 100,
                elapsedMs: 120,
                sectionIndex: 2,
                dateCreated: new Date('2023-02-11 21:52:58'),
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: new Date('2023-02-12 08:53:52'),
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [],
                listId: 'list-id',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        true,
        true,
        'list-id'
      )
    );
  });

  test('Accurately aggregates sequential lists into an array', () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
        l_id: 'list-id-2',
        l_color: 'Emerald',
        l_name: 'test list 2',
        l_hasTimeTracking: true,
        l_hasDueDates: false,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: false,
        lm_canRemove: true,
        lm_canComplete: false,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      }
    ];

    const lists = extractListsFromRows(rows);

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
      new List(
        'test list',
        'Amber',
        [new ListMember(user, true, true, true, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        true,
        true,
        'list-id'
      ),
      new List(
        'test list 2',
        'Emerald',
        [new ListMember(user, false, true, false, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id-2',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        false,
        true,
        'list-id-2'
      )
    ]);
  });

  test('Works even if the first record has no members', () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: null,
        lm_u_id: null,
        lm_canAdd: null,
        lm_canRemove: null,
        lm_canComplete: null,
        lm_canAssign: null,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      } as any,
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      },
      {
        l_id: 'list-id-2',
        l_color: 'Emerald',
        l_name: 'test list 2',
        l_hasTimeTracking: true,
        l_hasDueDates: false,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: false,
        lm_canRemove: true,
        lm_canComplete: false,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      }
    ];

    const lists = extractListsFromRows(rows);

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
      new List(
        'test list',
        'Amber',
        [new ListMember(user, true, true, true, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
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
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        true,
        true,
        'list-id'
      ),
      new List(
        'test list 2',
        'Emerald',
        [new ListMember(user, false, true, false, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id-2',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        false,
        true,
        'list-id-2'
      )
    ]);
  });

  test('Works even if the first list has no members', () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: null,
        lm_u_id: null,
        lm_canAdd: null,
        lm_canRemove: null,
        lm_canComplete: null,
        lm_canAssign: null,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      } as any,
      {
        l_id: 'list-id-2',
        l_color: 'Emerald',
        l_name: 'test list 2',
        l_hasTimeTracking: true,
        l_hasDueDates: false,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: false,
        lm_canRemove: true,
        lm_canComplete: false,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      }
    ];

    const lists = extractListsFromRows(rows);

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
      new List(
        'test list',
        'Amber',
        [],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        true,
        true,
        'list-id'
      ),
      new List(
        'test list 2',
        'Emerald',
        [new ListMember(user, false, true, false, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id-2',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        false,
        true,
        'list-id-2'
      )
    ]);
  });

  test('Works even if the first record has no sections', () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: null,
        ls_l_id: null,
        ls_name: null,
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
        ia_i_id: null,
        ia_role: null,
        ia_u_id: null,
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
      } as any,
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
        l_id: 'list-id-2',
        l_color: 'Emerald',
        l_name: 'test list 2',
        l_hasTimeTracking: true,
        l_hasDueDates: false,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: false,
        lm_canRemove: true,
        lm_canComplete: false,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      }
    ];

    const lists = extractListsFromRows(rows);

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
      new List(
        'test list',
        'Amber',
        [new ListMember(user, true, true, true, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        true,
        true,
        'list-id'
      ),
      new List(
        'test list 2',
        'Emerald',
        [new ListMember(user, false, true, false, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id-2',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        false,
        true,
        'list-id-2'
      )
    ]);
  });

  test('Works even if the first list has no sections', () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: null,
        ls_l_id: null,
        ls_name: null,
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
        ia_i_id: null,
        ia_role: null,
        ia_u_id: null,
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
      } as any,
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id-2',
        lm_canAdd: false,
        lm_canRemove: false,
        lm_canComplete: false,
        lm_canAssign: false,
        ls_id: null,
        ls_l_id: null,
        ls_name: null,
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
        ia_i_id: null,
        ia_role: null,
        ia_u_id: null,
        u_id: 'user-id-2',
        u_username: 'username 2',
        u_email: 'test-2@example.com',
        u_password: 'secret-2',
        u_color: 'Green',
        u_dateCreated: new Date('2023-02-15 21:51:01'),
        u_dateSignedIn: new Date('2023-02-15 21:51:01'),
        t_id: null,
        t_name: null,
        t_color: null,
        t_i_id: null,
        constructor: { name: 'RowDataPacket' }
      } as any,
      {
        l_id: 'list-id-2',
        l_color: 'Emerald',
        l_name: 'test list 2',
        l_hasTimeTracking: true,
        l_hasDueDates: false,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: false,
        lm_canRemove: true,
        lm_canComplete: false,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      }
    ];

    const lists = extractListsFromRows(rows);

    const user = new User(
      'username',
      'test@example.com',
      'secret',
      new Date('2023-02-11 21:51:01'),
      new Date('2023-02-11 21:51:01'),
      { id: 'user-id', color: 'Emerald' }
    );
    const user_2 = new User(
      'username 2',
      'test-2@example.com',
      'secret-2',
      new Date('2023-02-15 21:51:01'),
      new Date('2023-02-15 21:51:01'),
      { id: 'user-id-2', color: 'Green' }
    );

    expect(lists).toHaveLength(2);
    expect(lists).toEqual([
      new List(
        'test list',
        'Amber',
        [
          new ListMember(user, true, true, true, true),
          new ListMember(user_2, false, false, false, false)
        ],
        [],
        true,
        true,
        true,
        'list-id'
      ),
      new List(
        'test list 2',
        'Emerald',
        [new ListMember(user, false, true, false, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id-2',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        false,
        true,
        'list-id-2'
      )
    ]);
  });

  test("Works even if the first record's section has no items", () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
        ia_i_id: null,
        ia_role: null,
        ia_u_id: null,
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
      } as any,
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
        l_id: 'list-id-2',
        l_color: 'Emerald',
        l_name: 'test list 2',
        l_hasTimeTracking: true,
        l_hasDueDates: false,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: false,
        lm_canRemove: true,
        lm_canComplete: false,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
      }
    ];

    const lists = extractListsFromRows(rows);

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
      new List(
        'test list',
        'Amber',
        [new ListMember(user, true, true, true, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        true,
        true,
        'list-id'
      ),
      new List(
        'test list 2',
        'Emerald',
        [new ListMember(user, false, true, false, true)],
        [
          new ListSection(
            'test section',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id-2',
                sectionId: 'section-id'
              })
            ],
            'section-id'
          )
        ],
        true,
        false,
        true,
        'list-id-2'
      )
    ]);
  });

  test("Works even if the first list's first section has no items", () => {
    const rows: DB_List[] = [
      {
        l_id: 'list-id',
        l_color: 'Amber',
        l_name: 'test list',
        l_hasTimeTracking: true,
        l_hasDueDates: true,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: true,
        lm_canRemove: true,
        lm_canComplete: true,
        lm_canAssign: true,
        ls_id: 'section-id',
        ls_l_id: 'list-id',
        ls_name: 'test section',
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
        ia_i_id: null,
        ia_role: null,
        ia_u_id: null,
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
      } as any,
      {
        l_id: 'list-id-2',
        l_color: 'Emerald',
        l_name: 'test list 2',
        l_hasTimeTracking: true,
        l_hasDueDates: false,
        l_isAutoOrdered: true,
        lm_l_id: 'list-id',
        lm_u_id: 'user-id',
        lm_canAdd: false,
        lm_canRemove: true,
        lm_canComplete: false,
        lm_canAssign: true,
        ls_id: 'section-id-2',
        ls_l_id: 'list-id',
        ls_name: 'test section 2',
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
      }
    ];

    const lists = extractListsFromRows(rows);

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
      new List(
        'test list',
        'Amber',
        [new ListMember(user, true, true, true, true)],
        [new ListSection('test section', [], 'section-id')],
        true,
        true,
        true,
        'list-id'
      ),
      new List(
        'test list 2',
        'Emerald',
        [new ListMember(user, false, true, false, true)],
        [
          new ListSection(
            'test section 2',
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
                dateDue: new Date('2023-02-14 00:00:00'),
                dateStarted: new Date('2023-02-12 09:03:51'),
                dateCompleted: null,
                assignees: [new Assignee(user, 'assignee-role')],
                tags: [new Tag('tag-name', 'Amber', 'tag-id')],
                listId: 'list-id-2',
                sectionId: 'section-id-2'
              })
            ],
            'section-id-2'
          )
        ],
        true,
        false,
        true,
        'list-id-2'
      )
    ]);
  });

  test('Returns an empty array when given no rows', () => {
    const lists = extractListsFromRows([]);

    expect(lists).toHaveLength(0);
  });
});
