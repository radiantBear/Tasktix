'use client';

import { AddListSection, ListSection } from '@/components/ListSection';
import { addSnackbar } from '@/components/Snackbar';
import { api } from '@/lib/api';
import { default as ListModel } from "@/lib/model/list";
import { default as ListSectionModel } from "@/lib/model/listSection";
import Tag from '@/lib/model/tag';
import Color from '@/lib/model/color';
import { useState } from 'react';

export default function List({ startingList, startingTagsAvailable }: { startingList: string, startingTagsAvailable: string }) {
  const [list, setList] = useState<ListModel>(JSON.parse(startingList));
  const [tagsAvailable, setTagsAvailable] = useState<Tag[]>(JSON.parse(startingTagsAvailable));

  function addNewTag(name: string, color: Color) {
    return new Promise((resolve, reject) => {
      api.post(`/list/${list.id}/tag`, { name, color })
        .then(res => {
          const id = res.content?.split('/').at(-1) || '';
          const newTags = structuredClone(tagsAvailable);
          newTags.push(new Tag(name, color, id));
          setTagsAvailable(newTags);

          resolve(id);
        })
        .catch(err => reject(err));
    });
  }
  
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
      {list.sections.map(section => <ListSection key={section.id} id={section.id} name={section.name} listItems={JSON.stringify(section.items)} tagsAvailable={tagsAvailable} deleteSection={deleteListSection.bind(null, section.id)} addNewTag={addNewTag} />)}
      <AddListSection listId={list.id} addListSection={addListSection} />
    </>
  );
}