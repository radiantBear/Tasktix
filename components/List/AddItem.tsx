import { api } from '@/lib/api';
import { dateToInput, inputToDate, parseTime } from '@/lib/date'
import { Button, Input, Select, SelectItem, Selection } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';
import { Check, Plus } from 'react-bootstrap-icons';
import { addSnackbar } from '@/components/Snackbar';
import ListItem from '@/lib/model/listItem';
import TimeInput from '../TimeInput';

export default function AddItem({ sectionId, addItem }: { sectionId: string, addItem: (_: ListItem) => any }) {
  const zeroMin = new Date();
  zeroMin.setTime(0);
  const startingInputValues = {name: '', dueDate: new Date(), priority: new Set(['Low']), duration: 0};

  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<{name: string, dueDate: Date, priority: Selection, duration: number}>(startingInputValues);
  const focusInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if(isOpen)
      focusInput.current?.focus();
  }, [isOpen]);

  function setName(name: string): void {
    setValues({name, dueDate: values.dueDate, priority: new Set(values.priority), duration: values.duration});
  }
  function setDueDate(date: string): void {
    setValues({name: values.name, dueDate: inputToDate(date), priority: new Set(values.priority), duration: values.duration});
  }
  function setPriority(priority: Selection): void {
    setValues({name: values.name, dueDate: values.dueDate, priority, duration: values.duration});
  }
  function setExpectedDuration(duration: number): void {
    setValues({name: values.name, dueDate: values.dueDate, priority: new Set(values.priority), duration: duration});
  }

  function createItem() {
    const priority = (values.priority != 'all' && values.priority.keys().next().value) || 'Low';
    const duration = values.duration;
    api.post('/item', { ...values, sectionId, priority, duration })
      .then(res => {
        setValues(startingInputValues);

        const id = res.content?.split('/').at(-1);
        const item = new ListItem(values.name, duration, { priority, dateDue: values.dueDate, id });
        addItem(item);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <span className='flex justify-between items-center overflow-y-visible'>
      <span className='overflow-x-clip'>
        <span className={`flex gap-4 pr-4 transition-transform${isOpen ? '' : ' translate-x-full'}`}>
          <Input 
            label='Name'
            placeholder='Add item...' 
            value={values.name}
            onValueChange={setName}
            ref={input => focusInput.current = input }
            variant='underlined' 
            size='sm' 
            className='w-44 -mt-2' 
            classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
          />
          <Input 
            label='Due' 
            type='date' 
            value={dateToInput(values.dueDate)}
            onValueChange={setDueDate}
            variant='underlined' 
            size='sm'
            className='w-24 -mt-2'
            classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
          />
          <Select
            variant='underlined' 
            labelPlacement='outside' 
            size='sm' 
            className={'w-24 -mt-4'}
            label={<span className='ml-2 text-foreground'>Priority</span>}
            classNames={{trigger: `${(values.priority == 'all' || values.priority.has('High')) ? 'border-danger' : values.priority.has('Medium') ? 'border-warning' : 'border-success'}`, mainWrapper: '-mt-6'}}
            placeholder='Select...' 
            selectedKeys={values.priority}
            onSelectionChange={setPriority}
            color={`${(values.priority == 'all' || values.priority.has('High')) ? 'danger' : values.priority.has('Medium') ? 'warning' : values.priority.has('Low') ? 'success' : 'default'}`}
          >
            <SelectItem key='High' value='High' color='danger'>High</SelectItem>
            <SelectItem key='Medium' value='Medium' color='warning'>Medium</SelectItem>
            <SelectItem key='Low' value='Low' color='success'>Low</SelectItem>
          </Select>
          <TimeInput 
            label='Time'
            value={values.duration}
            onValueChange={setExpectedDuration}
            variant='underlined' 
            size='sm'
            className='w-12 -mt-2'
            classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
          />
          <Button onPress={createItem} variant='ghost' isIconOnly color='primary'><Check size={'1.25em'} /></Button>
        </span>
      </span>
      <Button variant='ghost' isIconOnly onPress={() => setIsOpen(!isOpen)} color={isOpen ? 'danger' : 'primary'}><Plus size={'1.5em'} className={`transition-transform ${isOpen ? ' -rotate-45' : ''}`}/></Button>
    </span>
  );
}