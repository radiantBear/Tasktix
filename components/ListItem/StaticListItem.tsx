import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@nextui-org/react';
import { formatDate } from '@/lib/date';
import ListItemModel from '@/lib/model/listItem';
import Color from '@/lib/model/color';
import Tag from '@/lib/model/tag';
import Tags from './Tags';
import Time from './Time';
import Priority from './Priority';
import Users from './Users';
import { api } from '@/lib/api';
import { addSnackbar } from '../Snackbar';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowCounterclockwise, Check, GripVertical, ThreeDots, TrashFill } from 'react-bootstrap-icons';
import TimeButton from './TimeButton';
import TimeInput from '../TimeInput';
import DateInput from '../DateInput';
import ListMember from '@/lib/model/listMember';
import { DragControls } from 'framer-motion';
import DateInput2 from '../DateInput2';
import Name from './Name';

export default function StaticListItem({ item, members, tagsAvailable, hasTimeTracking, hasDueDates, reorderControls, setStatus, setCompleted, updateDueDate, updateExpectedMs, deleteItem, addNewTag }: { item: ListItemModel, members: ListMember[], tagsAvailable: Tag[], hasTimeTracking: boolean, hasDueDates: boolean, reorderControls?: DragControls, setStatus: (status: ListItemModel['status']) => any, setCompleted: (status: ListItemModel['status'], date: ListItemModel['dateCompleted']) => any, updateDueDate: (date: Date) => any, updateExpectedMs: (ms: number) => any, deleteItem: () => any, addNewTag: (name: string, color: Color) => any }) {  
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

  function resetTime() {
    const status = item.status == 'Completed' ? 'Completed' : 'Unstarted'
    api.patch(`/item/${item.id}`, { startTime: null, status, elapsedMs: 0 })
      .then(res => {
        addSnackbar(res.message, 'success');
        _stopRunning();
        setElapsedLive(0);
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

  function updateName(name: string) {
    api.patch(`/item/${item.id}`, { name })
      .then(res => {
        addSnackbar(res.message, 'success');
        const newItem = structuredClone(item);
        newItem.name = name;
        // TODO: Start converting all functions to update the whole item
        setItem(newItem);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <div className={`p-4 bg-content1 flex gap-4 items-center justify-between w-full flex-wrap ${reorderControls || 'border-b-1 border-content3 last:border-b-0'}`}>
      <span className='flex gap-4 items-center justify-start grow'>
        {
          reorderControls 
            ? <div onPointerDown={e => {e.preventDefault(); if(!isComplete) reorderControls.start(e)}} className={`px-1 py-2 -mx-3 rounded-lg ${isComplete ? 'text-foreground/20' : 'text-foreground/50 cursor-grab'} text-lg`}>
                <GripVertical />
              </div>
            : <></>
        }
        <Checkbox tabIndex={0} isSelected={isComplete} onChange={setComplete} className='-mr-3' />
        <div className='flex grow-0 shrink-0 flex-col w-64 gap-0 -mt-3 -mb-1'>
          {
            isComplete 
              ? <span className={`text-sm line-through text-foreground/50 ${hasDueDates || 'mt-2'}`}>{item.name}</span>
              : (
                  <span className={`-ml-1 flex ${hasDueDates || 'mt-1'}`}>
                    <Name name={item.name} updateName={updateName} className='shrink' />
                  </span>
                )
          }
          {
            hasDueDates 
              ? (
                isComplete
                  ? <span className='text-xs text-secondary/75 relative top-3'>{item.dateCompleted ? 'Completed ' + formatDate(item.dateCompleted) : 'Due ' + (item.dateDue ? formatDate(item.dateDue) : '')}</span>
                  : (<DateInput color='secondary' displayContent={item.dateDue ? `Due ${formatDate(item.dateDue)}` : 'Set due date'} value={item.dateDue || new Date()} onValueChange={_updateDueDate} />)
              )
              : <></>
          }
        </div>
        <Priority isComplete={isComplete} startingPriority={item.priority} itemId={item.id} className='hidden md:flex' />
        <Tags itemId={item.id} initialTags={item.tags} isComplete={isComplete} tagsAvailable={tagsAvailable} addNewTag={addNewTag} className='hidden lg:flex' />
        {
          members.length > 1
            ? <Users itemId={item.id} assignees={item.assignees} members={members} isComplete={isComplete} />
            : <></>
        }
      </span>
      <span className='flex gap-4 items-center justify-end grow-0 shrink-0'>
        {
          hasTimeTracking
            ? (
              <span className='hidden xl:flex gap-4'>
                <span className={`flex gap-4 ${isComplete ? 'opacity-50' : ''}`}>
                  <ExpectedInput itemId={item.id} ms={item.expectedMs} disabled={isComplete} updateMs={updateExpectedMs} />
                  <span className='border-r-1 border-content3'></span>
                  <ElapsedInput ms={elapsedLive} disabled={isComplete} resetTime={resetTime} />
                </span>
                <TimeButton status={item.status} startRunning={startRunning} pauseRunning={pauseRunning} />
              </span>
            )
            : <></>
        }
        <More item={item} tagsAvailable={tagsAvailable} members={members} hasDueDates={hasDueDates} hasTimeTracking={hasTimeTracking} elapsedLive={elapsedLive} updateName={updateName} updateDueDate={_updateDueDate} addNewTag={addNewTag} updateExpectedMs={updateExpectedMs} startRunning={startRunning} pauseRunning={pauseRunning} resetTime={resetTime} setComplete={setComplete} deleteItem={_deleteItem} />
      </span>
    </div>
  );
}

function ExpectedInput({ itemId, ms, disabled, updateMs }: { itemId: string, ms: number|null, disabled: boolean, updateMs: (ms: number) => any }) {
  const [value, setValue] = useState(ms);
  const [isOpen, setIsOpen] = useState(false);

  function _updateTime(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api.patch(`/item/${itemId}`, { expectedMs: value })
      .then(res => {
        addSnackbar(res.message, 'success');
        if(value !== null)
          updateMs(value);
        setIsOpen(false);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <Popover placement='bottom' isOpen={isOpen} onOpenChange={open => {if(!disabled) setIsOpen(open)}}>
      <PopoverTrigger className='-mr-2 -my-3 -px-2 relative top-3'>
        <Button tabIndex={0} disabled={disabled} isIconOnly className={`w-fit !px-2 bg-transparent p-0 ${disabled ? '' : 'hover:bg-foreground/10'}`}>
          <Time label='Expected' ms={ms || 0} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-3'>
        <form onSubmit={_updateTime} className='flex flex-row items-center gap-2'>
          <TimeInput value={value || undefined} onValueChange={setValue} size='sm' variant='underlined' color='primary' className='w-12 grow-0' />
          <Button type='submit' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'>
            <Check />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function ElapsedInput({ disabled, ms, resetTime }: { disabled: boolean, ms: number, resetTime: () => any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover placement='bottom' isOpen={isOpen} onOpenChange={open => {if(!disabled) setIsOpen(open)}}>
      <PopoverTrigger className='-mx-2 -px-2'>
        <Button tabIndex={0} disabled={disabled} isIconOnly className={`w-fit !px-2 bg-transparent p-0 ${disabled ? '' : 'hover:bg-foreground/10'}`}>
          <Time label='Elapsed' ms={ms} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-2'>
        <Button variant='light' onPress={() => {resetTime(); setIsOpen(false)}} color='warning'>
          <ArrowCounterclockwise />
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function More({ item, tagsAvailable, members, hasDueDates, hasTimeTracking, elapsedLive, updateName, updateDueDate, addNewTag, updateExpectedMs, startRunning, pauseRunning, resetTime, setComplete, deleteItem }: { item: ListItemModel, tagsAvailable: Tag[], members: ListMember[], hasDueDates: boolean, hasTimeTracking: boolean, elapsedLive: number, updateName: (name: string) => any, updateDueDate: (date: Date) => any, addNewTag: (name: string, color: Color) => any, updateExpectedMs: (ms: number) => any, startRunning: () => any, pauseRunning: () => any, resetTime: () => any, setComplete: (e: ChangeEvent<HTMLInputElement>) => any, deleteItem: () => any }) {
  const isComplete = item.status == 'Completed';
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} variant='ghost' isIconOnly><ThreeDots /></Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='justify-center'>
                Details
              </ModalHeader>

              <ModalBody className='gap-4 py-4'>
                <div className='flex gap-4 items-center'>
                  <Checkbox tabIndex={0} isSelected={isComplete} onChange={setComplete} />
                  <span className='flex grow'>
                    <Name showLabel name={item.name} updateName={updateName} disabled={isComplete} />
                  </span>
                </div>
                <div className='flex gap-4 items-center'>
                  <Priority isComplete={isComplete} itemId={item.id} startingPriority={item.priority} wrapperClassName='!my-0 w-1/2' className='w-full' />
                  {
                    hasDueDates 
                      ? (
                        <DateInput2 disabled={isComplete} label='Due date' value={item.dateDue || undefined} onValueChange={updateDueDate} color='primary' variant='underlined' className='w-1/2' />
                      )
                      : <></>
                  }
                </div>

                <Tags itemId={item.id} initialTags={item.tags} isComplete={isComplete} tagsAvailable={tagsAvailable} addNewTag={addNewTag} className='py-2' />

                {
                  members.length > 1
                    ? <Users itemId={item.id} assignees={item.assignees} members={members} isComplete={isComplete} className='py-2' />
                    : <></>
                }

                <div className='flex gap-6 justify-between'>
                  {
                    hasTimeTracking
                      ? (
                        <>
                          <span className={`flex gap-6 ${isComplete ? 'opacity-50' : ''}`}>
                            <ExpectedInput itemId={item.id} ms={item.expectedMs} disabled={isComplete} updateMs={updateExpectedMs} />
                            <span className='border-r-1 border-content3'></span>
                            <ElapsedInput ms={elapsedLive} disabled={isComplete} resetTime={resetTime} />
                          </span>
                          <TimeButton status={item.status} startRunning={startRunning} pauseRunning={pauseRunning} />  
                        </>
                      )
                      : <></>
                  }
                  <Button onPress={() => { onClose(); deleteItem(); }} variant='ghost' color='danger'>
                    <TrashFill />Delete
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}