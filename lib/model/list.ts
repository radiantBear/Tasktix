import ListMember from "./listMember";
import { generateId } from "../generateId";

export default class List {
  id: string;
  name: string;
  members: ListMember[];

  constructor(name: string, members: ListMember[], id?: string) {
    if(!id)
      id = generateId();

    this.id = id;
    this.name = name;
    this.members = members;
  }
}