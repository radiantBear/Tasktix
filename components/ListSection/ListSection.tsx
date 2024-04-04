import { useState } from 'react';
import Item from './Item';
import AddItem from './AddItem';
import ListItem from '@/lib/model/listItem';
import Color from '@/lib/model/color';
import { TrashFill } from 'react-bootstrap-icons';
import { Button } from '@nextui-org/react';
import Tag from '@/lib/model/tag';

export default function ListSection({ id, name, startingItems, tagsAvailable, deleteSection, addNewTag }: { id: string, name: string, startingItems: ListItem[], tagsAvailable: Tag[], deleteSection: () => any, addNewTag: (name: string, color: Color) => any }) {
  const [items, setItems] = useState<ListItem[]>(startingItems);

  function setStatus(id: string, status: ListItem['status']) {
    const newItems = structuredClone(items);
    for(let item of newItems)
      if(item.id == id)
        item.status = status;
    setItems(newItems);
  }

  function addItem(item: ListItem) {
    const newItems = structuredClone(items);
    newItems.push(item);
    setItems(newItems);
  }

  function deleteItem(id: string) {
    const newItems = structuredClone(items);
    for(let i = 0; i < newItems.length; i++)
      if(newItems[i].id == id)
        newItems.splice(i, 1);
    setItems(newItems);
  }

  return (
    <div className='rounded-md w-100 overfLow-hidden border-1 border-content3 box-border'>
      <div className='bg-content3 font-bold p-4 h-16 flex items-center justify-between'>
        <span>{name}</span>
        <span className='flex gap-4'>
          <AddItem sectionId={id} addItem={addItem} />
          <Button onPress={deleteSection} isIconOnly variant='ghost' color='danger'><TrashFill /></Button>
        </span>
      </div>
      {items.map(item => <Item key={item.id} item={item} tagsAvailable={tagsAvailable} setStatus={setStatus.bind(null, item.id)} deleteItem={deleteItem.bind(null, item.id)} addNewTag={addNewTag} />)}
    </div>
  )
}