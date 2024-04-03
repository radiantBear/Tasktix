'use client';

import { AddListSection, ListSection } from '@/components/ListSection';
import { default as ListModel } from "@/lib/model/list";
import { default as ListSectionModel } from "@/lib/model/listSection";
import { useState } from "react";

export default function List({ startingList }: { startingList: string }) {
  const [list, setList] = useState<ListModel>(JSON.parse(startingList));
  
  function addListSection(section: ListSectionModel) {
    if(!list)
      return;

    const newList = structuredClone(list);
    newList.sections.push(section);
    setList(newList);
  }
  
  return (
    <>
      {list.sections.map(section => <ListSection key={section.id} id={section.id} name={section.name} listItems={JSON.stringify(section.items)} />)}
      <AddListSection listId={list.id} addListSection={addListSection} />
    </>
  );
}