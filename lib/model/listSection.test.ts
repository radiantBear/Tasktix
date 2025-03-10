import ListItem from './listItem';
import ListSection from './listSection';
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
  const listSection = new ListSection('testListSection', []);

  expect(listSection.id).toBe('mock-generated-id');
  expect(generateIdModule.generateId).toHaveBeenCalled();
});

test('Uses the provided id', () => {
  const listSection = new ListSection('testListSection', [], 'provided-id');

  expect(listSection.id).toBe('provided-id');
  expect(generateIdModule.generateId).not.toHaveBeenCalled();
});

test('Assigns all properties correctly', () => {
  const listItems = [
    new ListItem('listItem1', {}),
    new ListItem('listItem2', {})
  ];

  const listSection = new ListSection(
    'testListSection',
    listItems,
    'provided-id'
  );

  expect(listSection.name).toBe('testListSection');
  expect(listSection.items).toBe(listItems);
  expect(listSection.id).toBe('provided-id');
});
