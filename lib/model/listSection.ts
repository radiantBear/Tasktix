import z from 'zod';

import { generateId } from '../generateId';

import ListItem from './listItem';

export const ZodListSection = z.strictObject({
  id: z.string().length(16),
  name: z.string().min(1).max(64)
});

export default class ListSection {
  id: string;
  name: string;
  items: ListItem[];

  constructor(name: string, items: ListItem[], id?: string) {
    if (!id) id = generateId();

    this.id = id;
    this.name = name;
    this.items = items;
  }
}
