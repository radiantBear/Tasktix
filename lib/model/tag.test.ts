import Tag from './tag';
import * as generateIdModule from '@/lib/generateId';

beforeEach(() => {
  jest
    .spyOn(generateIdModule, 'generateId')
    .mockReturnValue('mock-generated-id');
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('Generates an id if none provided', () => {
  const tag = new Tag('testTag', 'Amber');

  expect(tag.id).toBe('mock-generated-id');
  expect(generateIdModule.generateId).toHaveBeenCalled();
});

test('Uses the provided id', () => {
  const tag = new Tag('testTag', 'Amber', 'provided-id');

  expect(tag.id).toBe('provided-id');
  expect(generateIdModule.generateId).not.toHaveBeenCalled();
});

test('Assigns all properties correctly', () => {
  const tag = new Tag('testTag', 'Amber', 'provided-id');

  expect(tag.name).toBe('testTag');
  expect(tag.color).toBe('Amber');
  expect(tag.id).toBe('provided-id');
});
