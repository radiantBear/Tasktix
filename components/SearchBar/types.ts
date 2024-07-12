import Color from '@/lib/model/color';

export interface InputOptionGroup {
  label: string,
  options: InputOption[]
}

export interface InputOption {
  type: 'String' | 'Select' | 'Date' | 'Time' | 'Toggle',
  label: string,
  selectOptions?: { name: string, color?: Color }[]
}