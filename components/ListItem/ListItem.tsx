import { Button, Checkbox, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { formatDate } from '@/lib/date';
import ListItemModel from '@/lib/model/listItem';
import Color from '@/lib/model/color';
import Tag from '@/lib/model/tag';
import User from '@/lib/model/user';
import More from './More';
import Tags from './Tags';
import Time from './Time';
import Priority from './Priority';
import Users from './Users';
import { api } from '@/lib/api';
import { addSnackbar } from '../Snackbar';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Check } from 'react-bootstrap-icons';
import TimeButton from './TimeButton';
import TimeInput from '../TimeInput';
import DateInput from '../DateInput';
import ListMember from '@/lib/model/listMember';

export default function ListItem({ item, members, tagsAvailable, setStatus, setCompleted, updateDueDate, updateExpectedMs, deleteItem, addNewTag }: { item: ListItemModel, members: ListMember[], tagsAvailable: Tag[], setStatus: (status: ListItemModel['status']) => any, setCompleted: (status: ListItemModel['status'], date: ListItemModel['dateCompleted']) => any, updateDueDate: (date: Date) => any, updateExpectedMs: (ms: number) => any, deleteItem: () => any, addNewTag: (name: string, color: Color) => any }) {  
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

  function _updateDueDate(date: Date) {
    api.patch(`/item/${item.id}`, { dateDue: date })
      .then(res => {
        addSnackbar(res.message, 'success');
        updateDueDate(date);
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
        <Checkbox tabIndex={0} isSelected={isComplete} onChange={setComplete} className='-mr-3' />
        <div className='flex flex-col w-64 gap-0 -mt-3 -mb-1'>
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
          {
            isComplete
              ? <span className='text-xs text-secondary/75 relative top-3'>{item.dateCompleted ? 'Completed ' + formatDate(item.dateCompleted) : 'Due ' + formatDate(item.dateDue)}</span>
              : (<DateInput color='secondary' displayContent={`Due ${formatDate(item.dateDue)}`} value={item.dateDue || new Date()} onValueChange={_updateDueDate} />)
          }
        </div>
        <Priority isComplete={isComplete} startingPriority={item.priority} itemId={item.id} />
        <Tags itemId={item.id} initialTags={item.tags} isComplete={isComplete} tagsAvailable={tagsAvailable} addNewTag={addNewTag} />
        <Users assignees={item.assignees} members={members} isComplete={isComplete} />
      </span>
      <span className='flex gap-4 items-center justify-end'>
        <span className={`flex gap-4 ${isComplete ? 'opacity-50' : ''}`}>
          <ExpectedInput itemId={item.id} ms={item.expectedMs} disabled={isComplete} updateMs={updateExpectedMs} />
          <span className='border-r-1 border-content3'></span>
          <Time label='Elapsed' ms={elapsedLive} />
        </span>
        <TimeButton status={item.status} startRunning={startRunning} pauseRunning={pauseRunning} />
        <More deleteItem={_deleteItem} />
      </span>
    </div>
  );
}

function ExpectedInput({ itemId, ms, disabled, updateMs }: { itemId: string, ms: number, disabled: boolean, updateMs: (ms: number) => any }) {
  const [value, setValue] = useState(ms);
  const [isOpen, setIsOpen] = useState(false);
  const focusInput = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    if(isOpen)
      focusInput.current?.focus();
  }, [isOpen]);

  function _updateTime(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api.patch(`/item/${itemId}`, { expectedMs: value })
      .then(res => {
        addSnackbar(res.message, 'success');
        updateMs(value);
        setIsOpen(false);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <Popover placement='bottom' isOpen={isOpen} onOpenChange={open => {if(!disabled) setIsOpen(open)}}>
      <PopoverTrigger className='-mr-2 -my-3 -px-2 relative' style={{top: '10px'}}>
        <Button tabIndex={0} disabled={disabled} isIconOnly className={`w-fit !px-2 bg-transparent p-0 ${disabled ? '' : 'hover:bg-foreground/10'}`}>
          <Time label='Expected' ms={ms} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-3'>
        <form onSubmit={_updateTime} className='flex flex-row items-center gap-2'>
          <TimeInput value={value} onValueChange={setValue} withRef={input => focusInput.current = input} size='sm' variant='underlined' color='primary' className='w-12 grow-0' />
          <Button type='submit' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'>
            <Check />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}