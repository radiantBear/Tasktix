import { Checkbox } from '@nextui-org/react';
import { formatDate } from '@/lib/date';
import Item from '@/lib/model/item';
import More from './more';
import Tag from './tag';
import Time from './time';
import Priority from './priority';
import Users from './users';

export default function Item({ item, status, setIsComplete, setStatus }: { item: Item, status: Item['status'], setIsComplete: (_:React.ChangeEvent<HTMLInputElement>) => void, setStatus: (status: Item['status']) => void}) {  
  const isComplete = status == 'Completed';

  return (
    <div className='border-b-1 border-content3 p-4 bg-content1 flex gap-4 items-center justify-between w-full last:border-b-0 last:rounded-b-md'>
      <span className='flex gap-4 items-center justify-start w-full'>
        <Checkbox isSelected={isComplete} onChange={setIsComplete} />
        <div className='flex flex-col w-64 gap-1'>
          <span className={`text-sm ${isComplete ? 'line-through text-foreground/50' : ''}`}>{item.name}</span>
          <span className={`text-xs ${isComplete ? 'text-secondary/50 line-through' : 'text-secondary'}`}>Due {formatDate(item.dateDue)}</span>
        </div>
        <Priority isComplete={isComplete} startingPriority={item.priority} />
        <div className='w-1/4 flex items-center justify-start overflow-scroll flex-nowrap h-10'>
          {/* TODO: find way to say how many items are hidden */}
          {item.tags.map(tag => <Tag key={tag.id} tag={tag} isComplete={isComplete} />)}
        </div>
        <Users assignees={item.assignees} isComplete={isComplete} />
      </span>
      <span className='flex gap-4 items-center justify-end'>
        <Time expected={item.expectedDuration} elapsed={item.elapsedDuration} status={status} setStatus={setStatus} />
        <More />
      </span>
    </div>
  );
}