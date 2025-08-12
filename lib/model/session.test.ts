import * as generateIdModule from '@/lib/generateId';

import Session from './session';

beforeEach(() => {
  jest
    .spyOn(generateIdModule, 'generateId')
    .mockReturnValue('mock-generated-id');
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('Generates an id if none provided', () => {
  const session = new Session();

  expect(session.id).toBe('mock-generated-id');
  expect(generateIdModule.generateId).toHaveBeenCalled();
});

test('Uses the provided id', () => {
  const session = new Session('provided-id');

  expect(session.id).toBe('provided-id');
  expect(generateIdModule.generateId).not.toHaveBeenCalled();
});

test('Assigns all properties correctly', () => {
  const session = new Session('provided-id');

  expect(session.id).toBe('provided-id');
  expect(session.userId).toBeNull();
  expect(session.dateExpire).toBeNull();
});
