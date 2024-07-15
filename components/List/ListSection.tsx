import { Dispatch, SetStateAction, useState } from 'react';
import { ListItem, StaticListItem } from '@/components/ListItem';
import AddItem from '@/components/List/AddItem';
import ListItemModel from '@/lib/model/listItem';
import Color from '@/lib/model/color';
import { ChevronContract, ChevronExpand, TrashFill } from 'react-bootstrap-icons';
import { Button } from '@nextui-org/react';
import Tag from '@/lib/model/tag';
import { sortItems, sortItemsByCompleted, sortItemsByIndex } from '@/lib/sortItems';
import ListMember from '@/lib/model/listMember';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { api } from '@/lib/api';
import { addSnackbar } from '../Snackbar';

interface Item extends ListItemModel {
  visualIndex?: number;
}

export default function ListSection({ id, listId, name, startingItems, members, tagsAvailable, hasTimeTracking, hasDueDates, isAutoOrdered, deleteSection, addNewTag }: { id: string, listId: string, name: string, startingItems: ListItemModel[], members: ListMember[], tagsAvailable: Tag[], hasTimeTracking: boolean, hasDueDates: boolean, isAutoOrdered: boolean, deleteSection: () => any, addNewTag: (name: string, color: Color) => any }) {
  const [items, _setItems] = useState<Item[]>(startingItems.sort(sortItemsByIndex).sort(sortItemsByCompleted).map((item, i) => {
    const newItem: Item = structuredClone(item);
    newItem.visualIndex = i;
    return newItem;
  }));
  const setItems: Dispatch<SetStateAction<ListItemModel[]>>
    = newItems => {console.log(newItems); _setItems(newItems)}

  const [isCollapsed, setIsCollapsed] = useState(!items.reduce((prev, curr) => prev || curr.status != 'Completed', false));

  function setStatus(id: string, status: ListItemModel['status']) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id)
        item.status = status;
    setItems(newItems);
  }

  function setPaused(id: string) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id) {
        item.status = 'Paused';
        item.dateCompleted = null;
      }
    setItems(newItems);
  }

  function setCompleted(id: string, date: ListItemModel['dateCompleted']) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id) {
        item.status = 'Completed'
        item.dateCompleted = date;
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

  function updatePriority(id: string, priority: ListItemModel['priority']) {
    const newItems = structuredClone(items);
    for(const item of newItems)
      if(item.id == id)
        item.priority = priority;
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

  function reorderItem(item: ListItemModel, lastVisualIndex: number) {
    const index = items.findIndex(i => i.id == item.id);
    if(index == lastVisualIndex)
      return;
    
    const oldIndex = item.sectionIndex;
    const newIndex = index > lastVisualIndex 
      ? items[index-1].sectionIndex 
      : items[index+1].sectionIndex;

    if(newIndex == oldIndex)
      return;

    api.patch(`/list/${listId}/section/${id}/item`, { itemId: item.id, index: newIndex, oldIndex: oldIndex })
      .then(res => {
        addSnackbar(res.message, 'success');
        
        const index1 = Math.min(newIndex, oldIndex);
        const index2 = Math.max(newIndex, oldIndex);
        const newItems = structuredClone(items);
        for(let i = 0; i < newItems.length; i++) {
          newItems[i].visualIndex = i;
          if(newItems[i].sectionIndex >= index1 && newItems[i].sectionIndex <= index2)
            newItems[i].sectionIndex += oldIndex > newIndex ? 1 : -1;
          if(newItems[i].id == item.id)
            newItems[i].sectionIndex = newIndex;
        }
        setItems(newItems);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function deleteItem(id: string) {
    const newItems = structuredClone(items);
    for(let i = 0; i < newItems.length; i++)
      if(newItems[i].id == id)
        newItems.splice(i, 1);
    setItems(newItems);
  }

  return (
    <div className='rounded-md w-100 overflow-hidden border-2 border-content3 box-border shrink-0 shadow-lg shadow-content2'>
      <div className='bg-content3 font-bold p-4 h-16 flex items-center justify-between'>
        <span className='min-w-fit shrink-0'>
          <Button onPress={() => setIsCollapsed(!isCollapsed)} isIconOnly className='hover:bg-foreground/10 -ml-2 mr-2'>
            {isCollapsed ? <ChevronExpand /> : <ChevronContract />}
          </Button>
          {name}
        </span>
        <span className='flex gap-4'>
          <AddItem sectionId={id} hasTimeTracking={hasTimeTracking} hasDueDates={hasDueDates} nextIndex={items.length} addItem={addItem} />
          <Button tabIndex={0} onPress={deleteSection} isIconOnly variant='ghost' color='danger'><TrashFill /></Button>
        </span>
      </div>
      <AnimatePresence initial={isCollapsed}>
        {
          isCollapsed ||
          (
            <motion.section 
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { height: "auto" },
                collapsed: { height: 0 }
              }}
              transition={{ duration: 0.25 }}
            >
              {
                isAutoOrdered
                  ? (
                    items.sort(sortItems).map(item => (
                      <StaticListItem key={item.id} item={item} members={members} tagsAvailable={tagsAvailable} hasTimeTracking={hasTimeTracking} hasDueDates={hasDueDates} setStatus={setStatus.bind(null, item.id)} setPaused={setPaused.bind(null, item.id)} setCompleted={setCompleted.bind(null, item.id)} updateDueDate={updateDueDate.bind(null, item.id)} updatePriority={updatePriority.bind(null, item.id)} updateExpectedMs={updateExpectedMs.bind(null, item.id)} deleteItem={deleteItem.bind(null, item.id)} addNewTag={addNewTag} />
                    ))
                  )
                  : (
                    <Reorder.Group axis='y' values={items} onReorder={items => setItems(items.sort(sortItemsByCompleted))}>
                      {
                        items.map(item => (
                          <ListItem key={item.id} item={item} members={members} tagsAvailable={tagsAvailable} hasTimeTracking={hasTimeTracking} hasDueDates={hasDueDates} setStatus={setStatus.bind(null, item.id)} setPaused={setPaused.bind(null, item.id)} setCompleted={setCompleted.bind(null, item.id)} updateDueDate={updateDueDate.bind(null, item.id)} updatePriority={updatePriority.bind(null, item.id)} updateExpectedMs={updateExpectedMs.bind(null, item.id)} deleteItem={deleteItem.bind(null, item.id)} addNewTag={addNewTag} reorder={reorderItem.bind(null, item, item.visualIndex || 0)} />
                        ))
                      }
                    </Reorder.Group>
                  )
              }
            </motion.section>
          )
        }
      </AnimatePresence>
    </div>
  )
}