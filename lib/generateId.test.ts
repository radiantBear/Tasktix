import { generateId } from '@/lib/generateId';

test('Generates a 16-character ID by default', () => {
  const result = generateId();
  expect(result.length).toBe(16);
});

test('Generates IDs of the specified length', () => {
  const result = generateId(64);
  expect(result.length).toBe(64);

  const result2 = generateId(512);
  expect(result2.length).toBe(512);

  const result3 = generateId(1);
  expect(result3.length).toBe(1);
});

test('Generated IDs contain only numbers and letters', () => {
  crypto.getRandomValues = jest
    .fn()
    .mockReturnValueOnce(new Uint8Array([...Array(512).map((_, i) => i)]));

  const result2 = generateId(512);

  expect(result2).toMatch(/[0-9A-Za-z]{512}/);
});
