import ListMember from './listMember';
import User from './user';

test('Defaults all permissions to not granted', () => {
  const listMember = new ListMember(
    new User(
      'testListMember',
      'test@example.com',
      'secret',
      new Date(),
      new Date(),
      {}
    )
  );

  expect(listMember.canAdd).toBe(false);
  expect(listMember.canRemove).toBe(false);
  expect(listMember.canComplete).toBe(false);
  expect(listMember.canAssign).toBe(false);
});

test('Assigns all properties correctly', () => {
  const user = new User(
    'testListMember',
    'test@example.com',
    'secret',
    new Date(),
    new Date(),
    {}
  );

  const listMember = new ListMember(user, true, false, true, true);

  expect(listMember.user).toBe(user);
  expect(listMember.canAdd).toBe(true);
  expect(listMember.canRemove).toBe(false);
  expect(listMember.canComplete).toBe(true);
  expect(listMember.canAssign).toBe(true);
});
