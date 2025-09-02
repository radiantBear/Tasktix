import z from 'zod';

import { generateId } from '@/lib/generateId';

import ListMember from './listMember';
import ListSection from './listSection';
import { NamedColor, namedColors } from './color';

export const ZodList = z.strictObject({
  id: z.string().length(16),
  name: z.string().min(1).max(64),
  color: z.enum(namedColors),
  hasTimeTracking: z.boolean(),
  hasDueDates: z.boolean(),
  isAutoOrdered: z.boolean()
});

export default class List {
  id: string;
  name: string;
  color: NamedColor;
  hasTimeTracking: boolean;
  hasDueDates: boolean;
  isAutoOrdered: boolean;
  members: ListMember[];
  sections: ListSection[];

  constructor(
    name: string,
    color: NamedColor,
    members: ListMember[],
    sections: ListSection[],
    hasTimeTracking: boolean,
    hasDueDates: boolean,
    isAutoOrdered: boolean,
    id?: string
  ) {
    if (!id) id = generateId();

    this.id = id;
    this.name = name;
    this.color = color;
    this.hasTimeTracking = hasTimeTracking;
    this.hasDueDates = hasDueDates;
    this.isAutoOrdered = isAutoOrdered;
    this.members = members;
    this.sections = sections;
  }
}
