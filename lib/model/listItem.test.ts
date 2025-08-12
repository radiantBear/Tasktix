import * as generateIdModule from '@/lib/generateId';

import Assignee from './assignee';
import ListItem from './listItem';
import User from './user';
import Tag from './tag';

beforeEach(() => {
  jest
    .spyOn(generateIdModule, 'generateId')
    .mockReturnValue('mock-generated-id');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ListItem constructor', () => {
  test('Generates an id if none provided', () => {
    const listItem = new ListItem('testListItem', {});

    expect(listItem.id).toBe('mock-generated-id');
    expect(generateIdModule.generateId).toHaveBeenCalled();
  });

  test('Uses the provided id', () => {
    const listItem = new ListItem('testListItem', { id: 'provided-id' });

    expect(listItem.id).toBe('provided-id');
    expect(generateIdModule.generateId).not.toHaveBeenCalled();
  });

  test('Uses sane defaults for a new item when properties are unspecified', () => {
    const listItem = new ListItem('testListItem', {});

    expect(listItem.status).toBe('Unstarted');
    expect(listItem.priority).toBe('Low');
    expect(listItem.isUnclear).toBe(false);
    expect(listItem.expectedMs).toBe(null);
    expect(listItem.elapsedMs).toBe(0);
    expect(listItem.sectionIndex).toBe(0);
    expect(listItem.dateStarted).toBeNull();
    expect(listItem.dateCompleted).toBeNull();
    expect(listItem.assignees).toHaveLength(0);
    expect(listItem.tags).toHaveLength(0);
    expect(listItem.listId).toBeUndefined();
    expect(listItem.sectionId).toBeUndefined();
  });

  test('Assigns all properties correctly', () => {
    const assignees = [
      new Assignee(
        new User(
          'user1',
          'test@example.com',
          'secret',
          new Date(),
          new Date(),
          {}
        ),
        'role-string'
      )
    ];
    const tags = [new Tag('tag1', 'Amber'), new Tag('tag2', 'Cyan')];

    const listItem = new ListItem('testListItem', {
      status: 'Completed',
      priority: 'High',
      isUnclear: true,
      expectedMs: 1000,
      elapsedMs: 500,
      sectionIndex: 1,
      dateCreated: new Date('2021-01-01'),
      dateDue: new Date('2021-01-02'),
      dateStarted: new Date('2021-01-01'),
      dateCompleted: new Date('2021-01-02'),
      assignees: assignees,
      tags: tags,
      listId: 'listId',
      sectionId: 'sectionId',
      id: 'provided-id'
    });

    expect(listItem.name).toBe('testListItem');
    expect(listItem.status).toBe('Completed');
    expect(listItem.priority).toBe('High');
    expect(listItem.isUnclear).toBe(true);
    expect(listItem.expectedMs).toBe(1000);
    expect(listItem.elapsedMs).toBe(500);
    expect(listItem.sectionIndex).toBe(1);
    expect(listItem.dateCreated).toEqual(new Date('2021-01-01'));
    expect(listItem.dateDue).toEqual(new Date('2021-01-02'));
    expect(listItem.dateStarted).toEqual(new Date('2021-01-01'));
    expect(listItem.dateCompleted).toEqual(new Date('2021-01-02'));
    expect(listItem.assignees).toBe(assignees);
    expect(listItem.tags).toBe(tags);
    expect(listItem.listId).toBe('listId');
    expect(listItem.sectionId).toBe('sectionId');
    expect(listItem.id).toBe('provided-id');
  });
});
