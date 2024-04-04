import { Checkbox } from '@nextui-org/react';
import { formatDate } from '@/lib/date';
import ListItem from '@/lib/model/listItem';
import More from './More';
import Tags from './Tags';
import Time from './Time';
import Priority from './Priority';
import Users from './Users';
import { api } from '@/lib/api';
import { addSnackbar } from '../Snackbar';

export default function Item({ listId, item, setStatus, deleteItem }: { listId: string, item: ListItem, setStatus: (status: ListItem['status']) => void, deleteItem: () => any }) {  
  const isComplete = item.status == 'Completed';

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
        <Checkbox isSelected={isComplete} onChange={e => setStatus(e.target.checked ? 'Completed' : 'Paused')} />
        <div className='flex flex-col w-64 gap-1'>
          <span className={`text-sm ${isComplete ? 'line-through text-foreground/50' : ''}`}>{item.name}</span>
          <span className={`text-xs ${isComplete ? 'text-secondary/50 line-through' : 'text-secondary'}`}>Due {formatDate(item.dateDue)}</span>
        </div>
        <Priority isComplete={isComplete} startingPriority={item.priority} />
        <Tags listId={listId} itemId={item.id} initialTags={JSON.stringify(item.tags)} isComplete={isComplete} />
        <Users assignees={item.assignees} isComplete={isComplete} />
      </span>
      <span className='flex gap-4 items-center justify-end'>
        {/* <Time expected={item.expectedDuration} elapsed={item.elapsedDuration} status={item.status} setStatus={setStatus} /> */}
        <More deleteItem={_deleteItem} />
      </span>
    </div>
  );
}