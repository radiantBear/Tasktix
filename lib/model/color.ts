/**
 * Tasktix: A powerful and flexible task-tracking tool for all.
 * Copyright (C) 2025 Nate Baird & other Tasktix contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
