jest.mock('../generateId', () => ({
  generateId: jest.fn(() => 'mock-generated-id')
}));

import { generateId } from '../generateId';

import List from './list';
import ListMember from './listMember';
import ListSection from './listSection';
import User from './user';

beforeEach(() => {
  (generateId as jest.Mock).mockClear();
});

describe('List constructor', () => {
  test('Generates an id if none provided', () => {
    const list = new List('testList', 'Amber', [], [], false, false, false);

    expect(list.id).toBe('mock-generated-id');
    expect(generateId).toHaveBeenCalled();
  });

  test('Uses the provided id', () => {
    const list = new List(
      'testList',
      'Amber',
      [],
      [],
      false,
      false,
      false,
      'provided-id'
    );

    expect(list.id).toBe('provided-id');
    expect(generateId).not.toHaveBeenCalled();
  });

  test('Assigns all properties correctly', () => {
    const members = [
      new ListMember(
        new User(
          'user1',
          'test@example.com',
          'secret',
          new Date(),
          new Date(),
          {}
        )
      ),
      new ListMember(
        new User(
          'user2',
          'test@not-example.com',
          'an0th3rSecret',
          new Date(),
          new Date(),
          {}
        )
      )
    ];
    const sections = [
      new ListSection('section1', []),
      new ListSection('section2', [])
    ];

    const list = new List(
      'testListItem',
      'Amber',
      members,
      sections,
      true,
      false,
      true,
      'provided-id'
    );

    expect(list.name).toBe('testListItem');
    expect(list.color).toBe('Amber');
    expect(list.members).toBe(members);
    expect(list.sections).toBe(sections);
    expect(list.hasTimeTracking).toBe(true);
    expect(list.hasDueDates).toBe(false);
    expect(list.isAutoOrdered).toBe(true);
    expect(list.id).toBe('provided-id');
  });
});
