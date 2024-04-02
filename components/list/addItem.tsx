import { dateToInput, inputToDate } from '@/lib/date'
import { Button, Input, Select, SelectItem, Selection } from '@nextui-org/react';
import { useState } from 'react';
import { Plus } from 'react-bootstrap-icons';

export default function AddItem() {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<{name: string, dueDate: Date, priority: Selection}>({name: '', dueDate: new Date(), priority: new Set(['Low'])});

  function setName(name: string): void {
    setValues({name, dueDate: values.dueDate, priority: new Set(values.priority)});
  }
  function setDueDate(date: string): void {
    setValues({name: values.name, dueDate: inputToDate(date), priority: new Set(values.priority)});
  }
  function setPriority(priority: Selection): void {
    console.log(priority)
    setValues({name: values.name, dueDate: values.dueDate, priority});
  }

  return (
    <span className='flex justify-between items-center overflow-y-visible'>
      <span className='overflow-x-clip'>
        <span className={`flex gap-4 pr-4 transition-transform${isOpen ? '' : ' translate-x-full'}`}>
          <Input 
            placeholder='Add item...' 
            value={values.name}
            onValueChange={setName}
            variant='underlined' 
            size='sm' 
            className='w-44 mt-2' 
            classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
          />
          <Input 
            label='Due' 
            type='date' 
            value={dateToInput(values.dueDate)}
            onValueChange={setDueDate}
            variant='underlined' 
            size='sm'
            className='w-44 -mt-2'
            classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
          />
          <Select
            variant='underlined' 
            labelPlacement='outside' 
            size='sm' 
            className={'w-28 -mt-4'}
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
          <Button onPress={() => alert(values.dueDate)} variant='ghost' color='primary'>Add</Button>
        </span>
      </span>
      <Button variant='ghost' isIconOnly onPress={() => setIsOpen(!isOpen)} color={isOpen ? 'danger' : 'primary'}><Plus size={'1.5em'} className={`transition-transform ${isOpen ? ' -rotate-45' : ''}`}/></Button>
    </span>
  );
}