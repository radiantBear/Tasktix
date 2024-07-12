'use client';

import ListSection from './ListSection';
import AddListSection from '@/components/AddListSection';
import { addSnackbar } from '@/components/Snackbar';
import { api } from '@/lib/api';
import { default as ListModel } from "@/lib/model/list";
import { default as ListSectionModel } from "@/lib/model/listSection";
import Tag from '@/lib/model/tag';
import Color from '@/lib/model/color';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

export default function List({ startingList, startingTagsAvailable }: { startingList: string, startingTagsAvailable: string }) {
  const builtList: ListModel = JSON.parse(startingList);
  for(const section of builtList.sections) {
    for(const item of section.items) {
      item.dateCreated = new Date(item.dateCreated);
      item.dateDue = item.dateDue ? new Date(item.dateDue) : null;
      item.dateStarted = item.dateStarted ? new Date(item.dateStarted) : null;
      item.dateCompleted = item.dateCompleted ? new Date(item.dateCompleted) : null;
    }
  }
  
  const [list, setList] = useState<ListModel>(builtList);
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
    if(!confirm('Are you sure you want to delete this section? This action is irreversible.'))
      return;

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
      <span className='flex gap-2 items-center'>
          <SearchBar inputOptions={[
            { label: 'General', options: [
              { type: 'String', label: 'name' },
              { type: 'Select', label: 'priority', selectOptions: [{name: 'High', color: 'danger'}, {name: 'Medium', color: 'warning'}, {name: 'Low', color: 'success'}] },
              { type: 'Select', label: 'tag', selectOptions: [{name: 'TekBots', color: 'Orange'}, {name: 'Schedule-It', color: 'Blue'}] },
              { type: 'Select', label: 'user', selectOptions: [{name: 'You'}]},
            ]},
            { label: 'Completed', options: [
              { type: 'Toggle', label: 'completed' },
              { type: 'Date', label: 'completedBefore' },
              { type: 'Date', label: 'completedOn' },
              { type: 'Date', label: 'completedAfter' },
            ] },
            { label: 'Due', options: [
              { type: 'Date', label: 'dueBefore' },
              { type: 'Date', label: 'dueOn' },
              { type: 'Date', label: 'dueAfter' },
            ]},
            {
              label: 'Expected Time', options: [
                { type: 'Time', label: 'expectedTimeAbove'},
                { type: 'Time', label: 'expectedTimeAt'},
                { type: 'Time', label: 'expectedTimeBelow'},
              ]
            },
            {
              label: 'Elapsed Time', options: [
                { type: 'Time', label: 'elapsedTimeAbove'},
                { type: 'Time', label: 'elapsedTimeAt'},
                { type: 'Time', label: 'elapsedTimeBelow'},
              ]
            }
          ]} />
        </span>
      {list.sections.map(section => <ListSection key={section.id} id={section.id} listId={list.id} name={section.name} members={list.members} startingItems={section.items} tagsAvailable={tagsAvailable} hasTimeTracking={list.hasTimeTracking} hasDueDates={list.hasDueDates} isAutoOrdered={list.isAutoOrdered} deleteSection={deleteListSection.bind(null, section.id)} addNewTag={addNewTag} />)}
      <AddListSection listId={list.id} addListSection={addListSection} />
    </>
  );
}