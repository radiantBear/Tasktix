import { namedColors, NamedColor } from '@/lib/model/color';

import { getTextColor, getBackgroundColor, randomNamedColor } from './color';

describe('getTextColor', () => {
  test('Returns the correct NextUI text color class for valid semantic colors', () => {
    expect(getTextColor('danger')).toBe('text-danger');
    expect(getTextColor('warning')).toBe('text-warning');
    expect(getTextColor('success')).toBe('text-success');
  });

  test('Returns a valid Tailwind text color class for valid named colors', () => {
    expect(getTextColor('Pink')).toMatch(/^text-pink-(\d{2,3})$/);
    expect(getTextColor('Red')).toMatch(/^text-red-(\d{2,3})$/);
    expect(getTextColor('Orange')).toMatch(/^text-orange-(\d{2,3})$/);
    expect(getTextColor('Amber')).toMatch(/^text-amber-(\d{2,3})$/);
    expect(getTextColor('Yellow')).toMatch(/^text-yellow-(\d{2,3})$/);
    expect(getTextColor('Lime')).toMatch(/^text-lime-(\d{2,3})$/);
    expect(getTextColor('Green')).toMatch(/^text-green-(\d{2,3})$/);
    expect(getTextColor('Emerald')).toMatch(/^text-emerald-(\d{2,3})$/);
    expect(getTextColor('Cyan')).toMatch(/^text-cyan-(\d{2,3})$/);
    expect(getTextColor('Blue')).toMatch(/^text-blue-(\d{2,3})$/);
    expect(getTextColor('Violet')).toMatch(/^text-violet-(\d{2,3})$/);
  });
});

describe('getBackgroundColor', () => {
  test('Returns the correct NextUI background color class for valid semantic colors', () => {
    expect(getBackgroundColor('danger')).toBe('bg-danger');
    expect(getBackgroundColor('warning')).toBe('bg-warning');
    expect(getBackgroundColor('success')).toBe('bg-success');
  });

  test('Returns a valid Tailwind background color class for valid named colors', () => {
    expect(getBackgroundColor('Pink')).toMatch(/^bg-pink-(\d{2,3})$/);
    expect(getBackgroundColor('Red')).toMatch(/^bg-red-(\d{2,3})$/);
    expect(getBackgroundColor('Orange')).toMatch(/^bg-orange-(\d{2,3})$/);
    expect(getBackgroundColor('Amber')).toMatch(/^bg-amber-(\d{2,3})$/);
    expect(getBackgroundColor('Yellow')).toMatch(/^bg-yellow-(\d{2,3})$/);
    expect(getBackgroundColor('Lime')).toMatch(/^bg-lime-(\d{2,3})$/);
    expect(getBackgroundColor('Green')).toMatch(/^bg-green-(\d{2,3})$/);
    expect(getBackgroundColor('Emerald')).toMatch(/^bg-emerald-(\d{2,3})$/);
    expect(getBackgroundColor('Cyan')).toMatch(/^bg-cyan-(\d{2,3})$/);
    expect(getBackgroundColor('Blue')).toMatch(/^bg-blue-(\d{2,3})$/);
    expect(getBackgroundColor('Violet')).toMatch(/^bg-violet-(\d{2,3})$/);
  });
});

describe('randomNamedColor', () => {
  test('Returns a valid named color', () => {
    const result = randomNamedColor();

    expect(namedColors.includes(result)).toBe(true);
  });

  test('Returns random results across multiple calls', () => {
    const results = new Set<NamedColor>();

    for (let i = 0; i < 100; i++) {
      results.add(randomNamedColor());
    }

    // Ensure that at least a few different colors are picked
    expect(results.size).toBeGreaterThan(1);
  });
});
