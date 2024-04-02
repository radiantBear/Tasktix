import { useState } from 'react';
import {default as ItemType} from '@/lib/model/item';
import Item from './Item';
import AddItem from './AddItem';

export default function List({ name, listItems }: { name: string, listItems: ItemType[] }) {
  const startingItems: {[key: string]: ItemType['status']} = {};
  
  for(const item of listItems)
    startingItems[item.id] = item.status;

  const [items, setItems] = useState(startingItems);

  function setStatus(id: string, status: ItemType['status']) {
    const newItems = { ...items };
    newItems[id] = status;
    setItems(newItems);
  }

  function setIsComplete(id: string, event: React.ChangeEvent<HTMLInputElement>) {
    if(event.target.checked)
      setStatus(id, 'Completed');
    else
      setStatus(id, 'Paused');
  }

  return (
    <div className='rounded-md w-100 overfLow-hidden border-1 border-content3 box-border'>
      <div className='bg-content3 font-bold p-4 h-16 flex items-center justify-between'>
        <span>{name}</span>
        <span className='flex gap-4'>
          <AddItem />
        </span>
      </div>
      {listItems.map(item => <Item key={item.id} item={item} status={items[item.id]} setIsComplete={setIsComplete.bind(null, item.id)} setStatus={setStatus.bind(null, item.id)} />)}
    </div>
  )
}