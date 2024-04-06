'use client';

import { useState } from 'react';
import ListItem from '@/components/ListItem';
import ListItemModel from '@/lib/model/listItem';
import sortItems from '@/lib/sortItems';

export default function ListItemGroup({ startingItems }: { startingItems: string }) {
  const builtItems: ListItemModel[] = JSON.parse(startingItems);
  for(const item of builtItems) {
    item.dateCreated = new Date(item.dateCreated);
    item.dateDue = new Date(item.dateDue);
    item.dateStarted = item.dateStarted ? new Date(item.dateStarted) : null;
    item.dateCompleted = item.dateCompleted ? new Date(item.dateCompleted) : null;
  }
  
  const [items, setItems] = useState<ListItemModel[]>(builtItems);

  function setStatus(index: number, status: ListItemModel['status']) {
    const newItems = structuredClone(items);
    newItems[index].status = status;
    setItems(newItems);
  }

  function setCompleted(index: number, status: ListItemModel['status'], date: ListItemModel['dateCompleted']) {
    const newItems = structuredClone(items);
    newItems[index].status = status;
    newItems[index].dateCompleted = date;
    setItems(newItems);
  }

  function deleteItem(index: number) {
    const newItems = structuredClone(items);
    newItems.splice(index, 1);
    setItems(newItems);
  }

  return (
    <div className='rounded-md w-100 overflow-hidden border-1 border-content3 box-border'>
      {
        items.sort(sortItems).filter((item, idx) => item.status != 'Completed' && idx < 10).map((item, idx) => 
          <ListItem key={item.id} item={item} tagsAvailable={item.tags} setStatus={setStatus.bind(null, idx)} setCompleted={setCompleted.bind(null, idx)} deleteItem={deleteItem.bind(null, idx)} addNewTag={() => {}} />
        )
      }
    </div>
  );
}