import { useState } from 'react';
import ListItem from '@/components/ListItem';
import AddItem from '@/components/List/AddItem';
import ListItemModel from '@/lib/model/listItem';
import Color from '@/lib/model/color';
import { TrashFill } from 'react-bootstrap-icons';
import { Button } from '@nextui-org/react';
import Tag from '@/lib/model/tag';
import sortItems from '@/lib/sortItems';
import ListMember from '@/lib/model/listMember';
import { Reorder } from 'framer-motion';

export default function ListSection({ id, name, startingItems, members, tagsAvailable, hasTimeTracking, hasDueDates, deleteSection, addNewTag }: { id: string, name: string, startingItems: ListItemModel[], members: ListMember[], tagsAvailable: Tag[], hasTimeTracking: boolean, hasDueDates: boolean, deleteSection: () => any, addNewTag: (name: string, color: Color) => any }) {
  const [items, setItems] = useState<ListItemModel[]>(startingItems);

  function setStatus(id: string, status: ListItemModel['status']) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id)
        item.status = status;
    setItems(newItems);
  }

  function setCompleted(id: string, status: ListItemModel['status'], date: ListItemModel['dateCompleted']) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id) {
        item.dateCompleted = date;
        item.status = status;
      }
    setItems(newItems);
  }
  
  function updateExpectedMs(id: string, ms: number) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id)
        item.expectedMs = ms;
    setItems(newItems);
  }

  function updateDueDate(id: string, date: Date) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id)
        item.dateDue = date;
    setItems(newItems);
  }

  function addItem(item: ListItemModel) {
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
    <div className='rounded-md w-100 overflow-hidden border-1 border-content3 box-border shrink-0'>
      <div className='bg-content3 font-bold p-4 h-16 flex items-center justify-between'>
        <span>{name}</span>
        <span className='flex gap-4'>
          <AddItem sectionId={id} hasTimeTracking={hasTimeTracking} hasDueDates={hasDueDates} addItem={addItem} />
          <Button tabIndex={0} onPress={deleteSection} isIconOnly variant='ghost' color='danger'><TrashFill /></Button>
        </span>
      </div>
      <Reorder.Group axis='y' values={items} onReorder={setItems}>
        {
          items.map(item => (
              <ListItem key={item.id} item={item} members={members} tagsAvailable={tagsAvailable} hasTimeTracking={hasTimeTracking} hasDueDates={hasDueDates} setStatus={setStatus.bind(null, item.id)} setCompleted={setCompleted.bind(null, item.id)} updateDueDate={updateDueDate.bind(null, item.id)} updateExpectedMs={updateExpectedMs.bind(null, item.id)} deleteItem={deleteItem.bind(null, item.id)} addNewTag={addNewTag} />
          ))
        }
      </Reorder.Group>
    </div>
  )
}