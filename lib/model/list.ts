import ListMember from "./listMember";
import { generateId } from "../generateId";
import { DB_List } from "../database/list";
import { extractUserFromRow } from "./user";
import ListSection from "./listSection";

export default class List {
  id: string;
  name: string;
  members: ListMember[];
  sections: ListSection[];

  constructor(name: string, members: ListMember[], sections: ListSection[], id?: string) {
    if(!id)
      id = generateId();

    this.id = id;
    this.name = name;
    this.members = members;
    this.sections = sections;
  }
}

export function extractListFromRow(row: DB_List): List {
  const user = extractUserFromRow(row);

  const listMember = 
    row.u_id 
      ? [new ListMember(user, row.la_canAdd, row.la_canRemove, row.la_canComplete, row.la_canRemove)]
      : [];
  const listSection = 
    row.ls_name
      ? [new ListSection(row.ls_name, row.ls_id)]
      : [];


  
  const list = new List(row.l_name, listMember, listSection, row.l_id);
  list.id = row.l_id;

  return list;
}

export function mergeLists(original: List[]): List[] {
  const accumulator: List[] = [];
  
  for(const current of original) {
    if(accumulator.at(-1)?.id == current.id) {
      accumulator.at(-1)?.members.splice(-1, 0, ...current.members)
        .filter((item: ListMember, index: number, arr: ListMember[]) => arr.indexOf(item) == index);
      accumulator.at(-1)?.sections.splice(-1, 0, ...current.sections)
        .filter((item: ListSection, index: number, arr: ListSection[]) => arr.indexOf(item) == index);
    }
    else
      accumulator.push(current);
  }

  return accumulator;
}