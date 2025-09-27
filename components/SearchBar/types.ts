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

import { SharedSelection } from '@nextui-org/react';

import { Color } from '@/lib/model/color';

export interface InputOptionGroup {
  label: string;
  options: InputOption[];
}

export type InputOption =
  | {
      type: 'String' | 'Date' | 'Time' | 'Toggle';
      label: string;
      selectOptions?: never;
    }
  | {
      type: 'Select';
      label: string;
      selectOptions: { name: string; color?: Color }[];
    };

// TODO: improve type signature of `value`... needs to align with InputOption.type
type InputValueAction = {
  type: 'Add' | 'Update';
  label: string;
  value: string | SharedSelection | Date | number | boolean | undefined;
};
export type InputAction = { callback: (value: Filters) => unknown } & (
  | InputValueAction
  | {
      type: 'Remove';
      label: string;
      value?: never;
    }
  | {
      type: 'Clear';
      label?: never;
      value?: never;
    }
);

export type Filters = {
  [key: InputValueAction['label']]: InputValueAction['value'];
};
