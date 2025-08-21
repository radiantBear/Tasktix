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
