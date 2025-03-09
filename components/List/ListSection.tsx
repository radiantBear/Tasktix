import { useState } from 'react';
import { ListItem, StaticListItem } from '@/components/ListItem';
import AddItem from '@/components/List/AddItem';
import ListItemModel from '@/lib/model/listItem';
import { NamedColor } from '@/lib/model/color';
import {
  ChevronContract,
  ChevronExpand,
  ThreeDots,
  TrashFill
} from 'react-bootstrap-icons';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react';
import Tag from '@/lib/model/tag';
import {
  sortItems,
  sortItemsByCompleted,
  sortItemsByIndex
} from '@/lib/sortItems';
import ListMember from '@/lib/model/listMember';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { default as api } from '@/lib/api';
import { addSnackbar } from '../Snackbar';
import { Filters } from '../SearchBar/types';
import Name from '../Name';

interface Item extends ListItemModel {
  visualIndex?: number;
}

export default function ListSection({
  id,
  listId,
  name,
  startingItems,
  filters,
  members,
  tagsAvailable,
  hasTimeTracking,
  hasDueDates,
  isAutoOrdered,
  deleteSection,
  addNewTag
}: {
  id: string;
  listId: string;
  name: string;
  startingItems: ListItemModel[];
  filters: Filters;
  members: ListMember[];
  tagsAvailable: Tag[];
  hasTimeTracking: boolean;
  hasDueDates: boolean;
  isAutoOrdered: boolean;
  deleteSection: () => any;
  addNewTag: (name: string, color: NamedColor) => any;
}) {
  // TODO: Update to use hashmap: don't iterate over every value when finding the right one to modify
  const [items, setItems] = useState<Item[]>(
    startingItems
      .sort(sortItemsByIndex)
      .sort(sortItemsByCompleted)
      .map((item, i) => {
        const newItem: Item = structuredClone(item);
        newItem.visualIndex = i;
        return newItem;
      })
  );

  const [isCollapsed, setIsCollapsed] = useState(
    !items.reduce((prev, curr) => prev || curr.status != 'Completed', false)
  );

  function setStatus(
    id: string,
    status: ListItemModel['status'],
    dateCompleted?: ListItemModel['dateCompleted']
  ) {
    const newItems = structuredClone(items);
    for (const item of newItems)
      if (item.id == id) {
        item.status = status;
        if (dateCompleted !== undefined) item.dateCompleted = dateCompleted;
      }
    setItems(newItems);
  }

  function updateExpectedMs(id: string, ms: number) {
    const newItems = structuredClone(items);
    for (const item of newItems) if (item.id == id) item.expectedMs = ms;
    setItems(newItems);
  }

  function updatePriority(id: string, priority: ListItemModel['priority']) {
    const newItems = structuredClone(items);
    for (const item of newItems) if (item.id == id) item.priority = priority;
    setItems(newItems);
  }

  function updateDueDate(id: string, date: Date) {
    const newItems = structuredClone(items);
    for (const item of newItems) if (item.id == id) item.dateDue = date;
    setItems(newItems);
  }

  function addItem(item: ListItemModel) {
    const newItems = structuredClone(items);
    newItems.push(item);
    setItems(newItems);
    setIsCollapsed(false);
  }

  function reorderItem(item: ListItemModel, lastVisualIndex: number) {
    const index = items.findIndex(i => i.id == item.id);
    if (index == lastVisualIndex) return;

    const oldIndex = item.sectionIndex;
    const newIndex =
      index > lastVisualIndex
        ? items[index - 1].sectionIndex
        : items[index + 1].sectionIndex;

    if (newIndex == oldIndex) return;

    api
      .patch(`/list/${listId}/section/${id}/item`, {
        itemId: item.id,
        index: newIndex,
        oldIndex: oldIndex
      })
      .then(res => {
        addSnackbar(res.message, 'success');

        const index1 = Math.min(newIndex, oldIndex);
        const index2 = Math.max(newIndex, oldIndex);
        const newItems = structuredClone(items);
        for (let i = 0; i < newItems.length; i++) {
          newItems[i].visualIndex = i;
          if (
            newItems[i].sectionIndex >= index1 &&
            newItems[i].sectionIndex <= index2
          )
            newItems[i].sectionIndex += oldIndex > newIndex ? 1 : -1;
          if (newItems[i].id == item.id) newItems[i].sectionIndex = newIndex;
        }
        setItems(newItems);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function deleteItem(id: string) {
    const newItems = structuredClone(items);
    for (let i = 0; i < newItems.length; i++)
      if (newItems[i].id == id) newItems.splice(i, 1);
    setItems(newItems);
  }

  return (
    <div className='rounded-md w-100 overflow-hidden border-2 border-content3 box-border shrink-0 shadow-lg shadow-content2'>
      <div className='bg-content3 font-bold p-4 h-16 flex items-center justify-between'>
        <span className='min-w-fit shrink-0 flex'>
          <Button
            onPress={() => setIsCollapsed(!isCollapsed)}
            isIconOnly
            className='hover:bg-foreground/10 -ml-2 mr-2'
          >
            {isCollapsed ? <ChevronExpand /> : <ChevronContract />}
          </Button>
          <Name
            name={name}
            updateName={() => null}
            className='mt-0.5'
            classNames={{ input: 'text-md' }}
          />
        </span>
        <span className='flex gap-4'>
          <AddItem
            sectionId={id}
            hasTimeTracking={hasTimeTracking}
            hasDueDates={hasDueDates}
            nextIndex={items.length}
            addItem={addItem}
          />
          <Dropdown placement='bottom'>
            <DropdownTrigger>
              <Button
                variant='light'
                isIconOnly
                className='border-2 border-content4 hover:!bg-content4'
              >
                <ThreeDots />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={key => {
                if (key == 'delete') deleteSection();
              }}
            >
              <DropdownItem
                key='delete'
                startContent={<TrashFill />}
                color='danger'
                className='text-danger'
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </span>
      </div>
      <AnimatePresence initial={isCollapsed}>
        {isCollapsed || (
          <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { height: 'auto' },
              collapsed: { height: 0 }
            }}
            transition={{ duration: 0.25 }}
          >
            {isAutoOrdered ? (
              items
                .filter(item => checkItemFilter(item, filters))
                .sort(sortItems.bind(null, hasTimeTracking, hasDueDates))
                .map(item => (
                  <StaticListItem
                    key={item.id}
                    item={item}
                    members={members}
                    tagsAvailable={tagsAvailable}
                    hasTimeTracking={hasTimeTracking}
                    hasDueDates={hasDueDates}
                    setStatus={setStatus.bind(null, item.id)}
                    setPaused={() => setStatus(item.id, 'Paused')}
                    setCompleted={setStatus.bind(null, item.id, 'Completed')}
                    updateDueDate={updateDueDate.bind(null, item.id)}
                    updatePriority={updatePriority.bind(null, item.id)}
                    updateExpectedMs={updateExpectedMs.bind(null, item.id)}
                    deleteItem={deleteItem.bind(null, item.id)}
                    addNewTag={addNewTag}
                  />
                ))
            ) : (
              <Reorder.Group
                axis='y'
                values={items}
                onReorder={items => setItems(items.sort(sortItemsByCompleted))}
              >
                {items
                  .filter(item => checkItemFilter(item, filters))
                  .map(item => (
                    <ListItem
                      key={item.id}
                      item={item}
                      members={members}
                      tagsAvailable={tagsAvailable}
                      hasTimeTracking={hasTimeTracking}
                      hasDueDates={hasDueDates}
                      setStatus={setStatus.bind(null, item.id)}
                      setPaused={() => setStatus(item.id, 'Paused')}
                      setCompleted={setStatus.bind(null, item.id, 'Completed')}
                      updateDueDate={updateDueDate.bind(null, item.id)}
                      updatePriority={updatePriority.bind(null, item.id)}
                      updateExpectedMs={updateExpectedMs.bind(null, item.id)}
                      deleteItem={deleteItem.bind(null, item.id)}
                      addNewTag={addNewTag}
                      reorder={reorderItem.bind(
                        null,
                        item,
                        item.visualIndex || 0
                      )}
                    />
                  ))}
              </Reorder.Group>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function checkItemFilter(item: ListItemModel, filters: Filters): boolean {
  for (const key in filters)
    if (!compareFilter(item, key, filters[key])) return false;

  return true;
}

function compareFilter(item: ListItemModel, key: string, value: any): boolean {
  if (value == undefined) return false;

  switch (key) {
    case 'name':
      return value == item.name;

    case 'priority':
      return value && value.has(item.priority);

    case 'tag':
      return (
        value &&
        item.tags
          .map(curr => value.has(curr.name))
          .reduce((prev: boolean, curr: boolean) => prev || curr)
      );

    case 'user':
      return item.assignees
        .map(curr => value.has(curr.user.username))
        .reduce((prev: boolean, curr: boolean) => prev || curr);

    case 'status':
      return value && value.has(item.status);

    case 'completedBefore':
      if (value) value.setHours(0, 0, 0, 0);
      return (
        !!item.dateCompleted &&
        value &&
        value.getTime() > item.dateCompleted.getTime()
      );
    case 'completedOn':
      const start = structuredClone(value);
      const end = structuredClone(value);
      if (start) {
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        end.setDate(value.getDate() + 1);
      }
      return (
        !!item.dateCompleted &&
        value &&
        start.getTime() <= item.dateCompleted.getTime() &&
        end.getTime() > item.dateCompleted.getTime()
      );
    case 'completedAfter':
      if (value) value.setHours(23, 59, 59, 999);
      return (
        !!item.dateCompleted &&
        value &&
        value.getTime() < item.dateCompleted.getTime()
      );

    case 'dueBefore':
      return (
        !!item.dateDue && value && value.getTime() > item.dateDue.getTime()
      );
    case 'dueOn':
      return (
        !!item.dateDue && value && value.getTime() == item.dateDue.getTime()
      );
    case 'dueAfter':
      return (
        !!item.dateDue && value && value.getTime() < item.dateDue.getTime()
      );

    case 'expectedTimeBelow':
      return !!item.expectedMs && item.expectedMs < value;
    case 'expectedTimeAt':
      return !!item.expectedMs && item.expectedMs == value;
    case 'expectedTimeAbove':
      return !!item.expectedMs && item.expectedMs > value;

    case 'elapsedTimeBelow':
      return item.elapsedMs < value;
    case 'elapsedTimeAt':
      return item.elapsedMs == value;
    case 'elapsedTimeAbove':
      return item.elapsedMs > value;

    default:
      throw Error('Invalid option ' + key);
  }
}
