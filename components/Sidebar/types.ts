import { NamedColor } from '@/lib/model/color';

export interface Action {
  type: 'add' | 'remove';
  id: string;
  name?: string;
  color?: NamedColor;
}
