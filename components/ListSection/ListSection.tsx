import { useState } from 'react';
import {default as ItemType} from '@/lib/model/item';
import Item from './Item';
import AddItem from './AddItem';

export default function ListSection({ id, name, listItems }: { id: string, name: string, listItems: ItemType[] }) {
  const [items, setItems] = useState(listItems);

  function setStatus(id: string, status: ItemType['status']) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id)
        item.status = status;
    console.log(newItems)
    setItems(newItems);
  }

  return (
    <div className='rounded-md w-100 overfLow-hidden border-1 border-content3 box-border'>
      <div className='bg-content3 font-bold p-4 h-16 flex items-center justify-between'>
        <span>{name}</span>
        <span className='flex gap-4'>
          <AddItem sectionId={id} />
        </span>
      </div>
      {items.map(item => <Item key={item.id} item={item} setStatus={setStatus.bind(null, item.id)} />)}
    </div>
  )
}