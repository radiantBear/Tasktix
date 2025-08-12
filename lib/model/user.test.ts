import * as generateIdModule from '@/lib/generateId';
import * as colorModule from '@/lib/color';

import User from './user';

const fixedDateCreated = new Date('2020-01-01T00:00:00Z');
const fixedDateSignedIn = new Date('2020-01-02T00:00:00Z');

beforeEach(() => {
  jest
    .spyOn(generateIdModule, 'generateId')
    .mockReturnValue('mock-generated-id');
  jest
    .spyOn(colorModule, 'randomNamedColor')
    .mockReturnValue('mock-color' as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('Generates an id if none provided', () => {
  const user = new User(
    'testUser',
    'test@example.com',
    'secret',
    fixedDateCreated,
    fixedDateSignedIn,
    {}
  );

  expect(user.id).toBe('mock-generated-id');
  expect(generateIdModule.generateId).toHaveBeenCalled();
});

test('Uses the provided id', () => {
  const user = new User(
    'testUser',
    'test@example.com',
    'secret',
    fixedDateCreated,
    fixedDateSignedIn,
    { id: 'provided-id' }
  );

  expect(user.id).toBe('provided-id');
  expect(generateIdModule.generateId).not.toHaveBeenCalled();
});

test('Picks a color if none provided', () => {
  const user = new User(
    'testUser',
    'test@example.com',
    'secret',
    fixedDateCreated,
    fixedDateSignedIn,
    {}
  );

  expect(user.color).toBe('mock-color');
  expect(colorModule.randomNamedColor).toHaveBeenCalled();
});

test('Uses the provided color', () => {
  const user = new User(
    'testUser',
    'test@example.com',
    'secret',
    fixedDateCreated,
    fixedDateSignedIn,
    { color: 'provided-color' as any }
  );

  expect(user.color).toBe('provided-color');
  expect(colorModule.randomNamedColor).not.toHaveBeenCalled();
});

test('Assigns all properties correctly', () => {
  const user = new User(
    'testUser',
    'test@example.com',
    'secret',
    fixedDateCreated,
    fixedDateSignedIn,
    { id: 'provided-id', color: 'provided-color' as any }
  );

  expect(user.username).toBe('testUser');
  expect(user.email).toBe('test@example.com');
  expect(user.password).toBe('secret');
  expect(user.dateCreated).toBe(fixedDateCreated);
  expect(user.dateSignedIn).toBe(fixedDateSignedIn);
  expect(user.id).toBe('provided-id');
  expect(user.color).toBe('provided-color');
});
