import { generateId } from '../generateId';
import ListItem from './listItem';

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
