import { Button, Checkbox, Input } from '@nextui-org/react';
import { formatDate } from '@/lib/date';
import ListItemModel from '@/lib/model/listItem';
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
import { Check } from 'react-bootstrap-icons';
import TimeButton from './TimeButton';

export default function ListItem({ item, tagsAvailable, setStatus, setCompleted, deleteItem, addNewTag }: { item: ListItemModel, tagsAvailable: Tag[], setStatus: (status: ListItemModel['status']) => any, setCompleted: (status: ListItemModel['status'], date: ListItemModel['dateCompleted']) => any, deleteItem: () => any, addNewTag: (name: string, color: Color) => any }) {  
  const minute = 1000 * 60;
  const isComplete = item.status == 'Completed';

  const timer = useRef<NodeJS.Timeout>();
  const updateTime = useRef(() => {});
  const lastTime = useRef(new Date());
  const [elapsedLive, setElapsedLive] = useState(item.elapsedMs + (item.dateStarted ? Date.now() - item.dateStarted.getTime() : 0));
  const [name, setName] = useState(item.name);
  const [prevName, setPrevName] = useState(item.name);

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
    const newState: { status: 'Completed'|'Paused', dateCompleted: Date|null, startTime?: null, elapsedMs?: number } 
      = e.target.checked
        ? { status: 'Completed', dateCompleted: new Date() }
        : { status: 'Paused', dateCompleted: null };

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
        setCompleted(newState.status, newState.dateCompleted);
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

  function updateName() {
    api.patch(`/item/${item.id}`, { name })
      .then(res => {
        addSnackbar(res.message, 'success');
        setPrevName(name);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <div className='border-b-1 border-content3 p-4 bg-content1 flex gap-4 items-center justify-between w-full last:border-b-0'>
      <span className='flex gap-4 items-center justify-start w-full'>
        <Checkbox isSelected={isComplete} onChange={setComplete} />
        <div className='flex flex-col w-64 gap-1 -mt-3 -mb-1'>
          {
            isComplete 
              ? <span className='text-sm line-through text-foreground/50'>{item.name}</span>
              : <span className='-ml-1 flex'>
                  <Input value={name} onValueChange={setName} size='sm' variant='underlined' classNames={{inputWrapper: 'border-transparent', input: '-mb-2'}} />
                  <Button onPress={updateName} color='primary' isIconOnly className={`rounded-lg w-8 h-8 min-w-8 min-h-8 ${name == prevName ? 'invisible' : 'visible'}`}>
                    <Check />
                  </Button>
                </span>
          }
          <span className={`text-xs ${isComplete ? 'text-secondary/75' : 'text-secondary'}`}>{item.dateCompleted ? 'Completed ' + formatDate(item.dateCompleted) : 'Due ' + formatDate(item.dateDue)}</span>
        </div>
        <Priority isComplete={isComplete} startingPriority={item.priority} itemId={item.id} />
        <Tags itemId={item.id} initialTags={item.tags} isComplete={isComplete} tagsAvailable={tagsAvailable} addNewTag={addNewTag} />
        <Users assignees={item.assignees} isComplete={isComplete} />
      </span>
      <span className='flex gap-4 items-center justify-end'>
        <span className={`flex gap-4 ${isComplete ? 'opacity-50' : ''}`}>
          <Time label='Expected' ms={item.expectedMs} />
          <span className='border-r-1 border-content3'></span>
          <Time label='Elapsed' ms={elapsedLive} />
        </span>
        <TimeButton status={item.status} startRunning={startRunning} pauseRunning={pauseRunning} />
        <More deleteItem={_deleteItem} />
      </span>
    </div>
  );
}