export const semanticColors = ['danger', 'warning', 'success'] as const;

export const namedColors = [
  'Pink',
  'Red',
  'Orange',
  'Amber',
  'Yellow',
  'Lime',
  'Green',
  'Emerald',
  'Cyan',
  'Blue',
  'Violet'
] as const;

export const validColors = [...semanticColors, ...namedColors] as const;

export type SemanticColor = (typeof semanticColors)[number];
export type NamedColor = (typeof namedColors)[number];
export type Color = (typeof validColors)[number];

export const semanticColorSet: ReadonlySet<SemanticColor> = new Set(
  semanticColors
);
export const namedColorSet: ReadonlySet<NamedColor> = new Set(namedColors);
export const colorSet: ReadonlySet<Color> = new Set(validColors);
