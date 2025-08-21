import { Color } from '@/lib/model/color';

export interface InputOptionGroup {
  label: string;
  options: InputOption[];
}

export interface InputOption {
  type: 'String' | 'Select' | 'Date' | 'Time' | 'Toggle';
  label: string;
  selectOptions?: { name: string; color?: Color }[];
}

// TODO: improve type signature of `value`
export interface InputAction {
  type: 'Add' | 'Update' | 'Remove' | 'Clear';
  label: string;
  value: unknown;
  callback: (value: Filters) => unknown;
}

export type Filters = { [key: string]: unknown };
