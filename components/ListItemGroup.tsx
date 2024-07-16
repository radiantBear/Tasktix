'use client';

import { useState } from 'react';
import { StaticListItem } from '@/components/ListItem';
import { sortItemsByCompleted } from '@/lib/sortItems'; 
import { api } from '@/lib/api';
import ListItemModel from '@/lib/model/listItem';
import Tag from '@/lib/model/tag';
import ListMember from '@/lib/model/listMember';
import Color from '@/lib/model/color';

export default function ListItemGroup({ startingItems, startingTags, members, alternate }: { startingItems: string, startingTags: string, members: string, alternate: string }) {
  const builtItems: ListItemModel[] = JSON.parse(startingItems) || [];
  
  for(const item of builtItems) {
    item.dateCreated = new Date(item.dateCreated);
    item.dateDue = item.dateDue ? new Date(item.dateDue) : null;
    item.dateStarted = item.dateStarted ? new Date(item.dateStarted) : null;
    item.dateCompleted = item.dateCompleted ? new Date(item.dateCompleted) : null;
  }
  
  const [items, setItems] = useState<ListItemModel[]>(builtItems);
  const [tags, setTags] = useState<{[id: string]: Tag[]}>(JSON.parse(startingTags));
  const parsedMembers: {[id: string]: ListMember[]} = JSON.parse(members);

  function setStatus(index: number, status: ListItemModel['status'], dateCompleted?: ListItemModel['dateCompleted']) {
    const newItems = structuredClone(items);
    newItems[index].status = status;
    if(dateCompleted)
      newItems[index].dateCompleted = dateCompleted;
    setItems(newItems);
  }
  
  function updateExpectedMs(index: number, ms: number) {
    const newItems = structuredClone(items);
    newItems[index].expectedMs = ms;
    setItems(newItems);
  }

  function updatePriority(index: number, priority: ListItemModel['priority']) {
    const newItems = structuredClone(items);
    newItems[index].priority = priority;
    setItems(newItems);
  }

  function updateDueDate(index: number, date: Date) {
    const newItems = structuredClone(items);
    newItems[index].dateDue = date;
    setItems(newItems);
  }

  function deleteItem(index: number) {
    const newItems = structuredClone(items);
    newItems.splice(index, 1);
    setItems(newItems);
  }

  function addNewTag(listId: string|undefined, name: string, color: Color) {
    if(!listId)
      return new Promise((_, reject) => reject('No list ID'));

    return new Promise((resolve, reject) => {
      api.post(`/list/${listId}/tag`, { name, color })
        .then(res => {
          const id = res.content?.split('/').at(-1) || '';

          const newTags = structuredClone(tags);
          newTags[listId].push(new Tag(name, color, id));
          setTags(newTags);

          resolve(id);
        })
        .catch(err => reject(err));
    });
  }

  return (
    <div className='rounded-md w-100 overflow-hidden border-2 border-content3 box-border shadow-lg shadow-content2'>
      {
        items && items.length
          ? items.sort(sortItemsByCompleted).filter((item, idx) => item.status != 'Completed' && idx < 10).map((item, idx) => 
            <StaticListItem key={item.id} item={item} tagsAvailable={item.listId ? tags[item.listId] : []} members={item.listId ? parsedMembers[item.listId] : []} hasDueDates={false} hasTimeTracking={false} setStatus={setStatus.bind(null, idx)} setPaused={() => setStatus(idx, 'Paused', null)} setCompleted={setStatus.bind(null, idx, 'Completed')} updateDueDate={updateDueDate.bind(null, idx)} updatePriority={updatePriority.bind(null, idx)} updateExpectedMs={updateExpectedMs.bind(null, idx)} deleteItem={deleteItem.bind(null, idx)} addNewTag={addNewTag.bind(null, item.listId)} />
          )
          : <div className='h-16 flex items-center justify-center bg-content2'>{alternate}</div>
      }
    </div>
  );
}