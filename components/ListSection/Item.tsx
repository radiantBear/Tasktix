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
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function Item({ item, tagsAvailable, setStatus, deleteItem, addNewTag }: { item: ListItem, tagsAvailable: Tag[], setStatus: (status: ListItem['status']) => void, deleteItem: () => any, addNewTag: (name: string, color: Color) => any }) {  
  const minute = 1000 * 60;
  const isComplete = item.status == 'Completed';

  const timer = useRef<NodeJS.Timeout>();
  const updateTime = useRef(() => {});
  const lastTime = useRef(new Date());
  const [elapsedLive, setElapsedLive] = useState(item.elapsedMs + (item.dateStarted ? Date.now() - item.dateStarted.getTime() : 0));

  // Use effect to keep track of the changing timer function
  useEffect(() => {
    updateTime.current = () => {
      console.log(`update: setting timer for ${minute} ms`)
      timer.current = setTimeout(() => updateTime.current(), minute);
      setElapsedLive(elapsedLive + (Date.now() - lastTime.current.getTime()));
      lastTime.current = new Date();
    }
  });

  // Start the timer if it should be running when the component is first rendered
  useEffect(() => {
    if(item.status == 'In Progress' && !timer.current) {
      console.log(`onload: setting timer for ${minute - elapsedLive % minute + 5} ms`)
      timer.current = setTimeout(updateTime.current, minute - elapsedLive % minute + 5);
    }
    // Dependencies intentionally excluded to only trigger this when the component is first rendered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function _stopRunning() {
    if(timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  }

  function startRunning() {
    const startedDate = new Date();
    api.patch(`/item/${item.id}`, { startTime: startedDate, status: 'In Progress' })
      .then(res => {
        addSnackbar(res.message, 'success');
        lastTime.current = startedDate;
        clearTimeout(timer.current);    // Just for safety
        console.log(`startRunning: setting timer for ${minute - elapsedLive % minute + 5} ms`)
        timer.current = setTimeout(updateTime.current, minute - elapsedLive % minute + 5);
        setStatus('In Progress');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  function pauseRunning() {
    const newElapsed = elapsedLive + (Date.now() - lastTime.current.getTime());
    api.patch(`/item/${item.id}`, { startTime: null, elapsedMs: newElapsed, status: 'Paused' })
      .then(res => {
        _stopRunning();
        addSnackbar(res.message, 'success');
        setElapsedLive(newElapsed);   // Ensure time is up-to-date since timer was cancelled
        setStatus('Paused');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  function setComplete(e: ChangeEvent<HTMLInputElement>) {
    const newState: { status: 'Completed'|'Paused', startTime?: null, elapsedMs?: number } 
      = { status: e.target.checked ? 'Completed' : 'Paused' };

    const newElapsed = elapsedLive + (Date.now() - lastTime.current.getTime());

    // Stop timer if going
    if(e.target.checked && timer.current) {
      newState.startTime = null;
      newState.elapsedMs = newElapsed;
    }
    
    api.patch(`/item/${item.id}`, newState)
      .then(res => {
        _stopRunning();
        addSnackbar(res.message, 'success');
        if(newState.elapsedMs)
          setElapsedLive(newState.elapsedMs);   // Ensure time is up-to-date since timer was cancelled
        setStatus(newState.status);
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
        <Time expected={item.expectedMs} elapsed={elapsedLive} status={item.status} startRunning={startRunning} pauseRunning={pauseRunning} />
        <More deleteItem={_deleteItem} />
      </span>
    </div>
  );
}