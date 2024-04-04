'use client';

import { AddListSection, ListSection } from '@/components/ListSection';
import { addSnackbar } from '@/components/Snackbar';
import { api } from '@/lib/api';
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

  function deleteListSection(id: string) {
    api.delete(`/list/${list.id}/section/${id}`)
      .then(res => {
        addSnackbar(res.message, 'success');
        
        const newList = structuredClone(list);
        for(let i = 0; i < newList.sections.length; i++)
          if(newList.sections[i].id == id)
            newList.sections.splice(i, 1);
        setList(newList);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  return (
    <>
      {list.sections.map(section => <ListSection key={section.id} id={section.id} name={section.name} listId={list.id} listItems={JSON.stringify(section.items)} deleteSection={deleteListSection.bind(null, section.id)} />)}
      <AddListSection listId={list.id} addListSection={addListSection} />
    </>
  );
}