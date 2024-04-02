import { generateId } from "../generateId";

export default class ListSection {
  id: string;
  name: string;

  constructor(name: string, id?: string) {
    if(!id)
      id = generateId();

    this.id = id;
    this.name = name;
  }
}