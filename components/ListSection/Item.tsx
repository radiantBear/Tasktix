import { Checkbox } from '@nextui-org/react';
import { formatDate } from '@/lib/date';
import ListItem from '@/lib/model/listItem';
import Color from '@/lib/model/color';
import Tag from '@/lib/model/tag';
import More from './More';
import Tags from './Tags';
import Time from './Time';
import Priority from './Priority';
import Users from './Users';
import { api } from '@/lib/api';
import { addSnackbar } from '../Snackbar';
import { ChangeEvent } from 'react';

export default function Item({ item, tagsAvailable, setStatus, deleteItem, addNewTag }: { item: ListItem, tagsAvailable: Tag[], setStatus: (status: ListItem['status']) => void, deleteItem: () => any, addNewTag: (name: string, color: Color) => any }) {  
  const isComplete = item.status == 'Completed';
  
  function setComplete(e: ChangeEvent<HTMLInputElement>) {
    const status = e.target.checked ? 'Completed' : 'Paused';
    api.patch(`/item/${item.id}`, { status })
      .then(res => {
        addSnackbar(res.message, 'success');
        setStatus(status);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function _deleteItem() {
    api.delete(`/item/${item.id}`)
      .then(res => {
        deleteItem();
        addSnackbar(res.message, 'success')
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <div className='border-b-1 border-content3 p-4 bg-content1 flex gap-4 items-center justify-between w-full last:border-b-0 last:rounded-b-md'>
      <span className='flex gap-4 items-center justify-start w-full'>
        <Checkbox isSelected={isComplete} onChange={setComplete} />
        <div className='flex flex-col w-64 gap-1'>
          <span className={`text-sm ${isComplete ? 'line-through text-foreground/50' : ''}`}>{item.name}</span>
          <span className={`text-xs ${isComplete ? 'text-secondary/50 line-through' : 'text-secondary'}`}>Due {formatDate(item.dateDue)}</span>
        </div>
        <Priority isComplete={isComplete} startingPriority={item.priority} itemId={item.id} />
        <Tags itemId={item.id} initialTags={JSON.stringify(item.tags)} isComplete={isComplete} tagsAvailable={tagsAvailable} addNewTag={addNewTag} />
        <Users assignees={item.assignees} isComplete={isComplete} />
      </span>
      <span className='flex gap-4 items-center justify-end'>
        <Time expected={item.expectedDuration} elapsed={item.elapsedDuration} dateStarted={item.dateStarted} status={item.status} itemId={item.id} setStatus={setStatus} />
        <More deleteItem={_deleteItem} />
      </span>
    </div>
  );
}