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
      {list.sections.map(section => <ListSection key={section.id} id={section.id} name={section.name} listItems={[]} />)}
      {/* <ListSection name='Phase 1' listItems={[
        {id: '1', name: 'Plant a garden', dateDue: new Date(), status: 'Completed', priority: 'High', needsClarification: false, tags: [{id: '1', name: 'Planting', color: 'Lime'}, {id: '2', name: 'Outdoors', color: 'Cyan'}, {id: '3', name: 'Fun', color: 'Pink'}, {id: '4', name: 'One time', color: 'Emerald'}], expectedDuration: sixMin, elapsedDuration: fiveMin, assignees: [assignees[0]]},
        {id: '2', name: 'Water the garden', dateDue: tomorrow, status: 'Unstarted', priority: 'Low', needsClarification: false, tags: [{id: '2', name: 'Outdoors', color: 'Cyan'}], expectedDuration: fiveMin, elapsedDuration: zeroMin, assignees},
      ]} /> */}
      <AddListSection listId={list.id} addListSection={addListSection} />
    </>
  );
}