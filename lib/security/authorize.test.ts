import { authorize } from './authorize';
import { getUser } from '@/lib/session';
import User from '@/lib/model/user';
import { redirect } from 'next/navigation';

jest.mock('../session', () => ({
  getUser: jest.fn()
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authorize', () => {
  test('Does nothing if user is authenticated', async () => {
    (getUser as jest.Mock).mockResolvedValue(
      new User('username', 'email', 'password', new Date(), new Date(), {})
    );
    await authorize();

    expect(redirect).not.toHaveBeenCalled();
  });

  test('Redirects to /signIn if user is not authenticated', async () => {
    (getUser as jest.Mock).mockResolvedValue(null);
    await authorize();

    expect(redirect).toHaveBeenCalledWith('/signIn');
  });
});
