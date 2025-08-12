jest.mock('../generateId', () => ({
  generateId: jest.fn(() => 'mock-generated-id')
}));

import { generateId } from '../generateId';

import Tag from './tag';

beforeEach(() => {
  (generateId as jest.Mock).mockClear();
});

test('Generates an id if none provided', () => {
  const tag = new Tag('testTag', 'Amber');

  expect(tag.id).toBe('mock-generated-id');
  expect(generateId).toHaveBeenCalled();
});

test('Uses the provided id', () => {
  const tag = new Tag('testTag', 'Amber', 'provided-id');

  expect(tag.id).toBe('provided-id');
  expect(generateId).not.toHaveBeenCalled();
});

test('Assigns all properties correctly', () => {
  const tag = new Tag('testTag', 'Amber', 'provided-id');

  expect(tag.name).toBe('testTag');
  expect(tag.color).toBe('Amber');
  expect(tag.id).toBe('provided-id');
});
