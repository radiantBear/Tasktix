import Assignee from './assignee';
import User from './user';

test('Assigns all properties correctly', () => {
  const user = new User(
    'testListMember',
    'test@example.com',
    'secret',
    new Date(),
    new Date(),
    {}
  );

  const listMember = new Assignee(user, 'role-name');

  expect(listMember.user).toBe(user);
  expect(listMember.role).toBe('role-name');
});
