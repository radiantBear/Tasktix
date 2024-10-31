import { api } from '@/lib/api';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Selection, useDisclosure } from '@nextui-org/react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Check, Plus } from 'react-bootstrap-icons';
import { addSnackbar } from '@/components/Snackbar';
import ListItem from '@/lib/model/listItem';
import TimeInput from '../TimeInput';
import DateInput2 from '../DateInput2';

export default function AddItem({ sectionId, hasTimeTracking, hasDueDates, nextIndex, addItem }: { sectionId: string, hasTimeTracking: boolean, hasDueDates: boolean, nextIndex: number, addItem: (_: ListItem) => any }) {
  const zeroMin = new Date();
  zeroMin.setTime(0);
  const startingInputValues = {name: '', dueDate: new Date(), priority: new Set(['Low']), duration: 0};

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure();
  const [values, setValues] = useState<{name: string, dueDate?: Date, priority: Selection, duration?: number}>(startingInputValues);
  const focusInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if(isSliderOpen)
      focusInput.current?.focus();
  }, [isSliderOpen]);

  function setName(name: string): void {
    setValues({name, dueDate: values.dueDate, priority: new Set(values.priority), duration: values.duration});
  }
  function setDueDate(date: Date): void {
    setValues({name: values.name, dueDate: date, priority: new Set(values.priority), duration: values.duration});
  }
  function setPriority(priority: Selection): void {
    setValues({name: values.name, dueDate: values.dueDate, priority, duration: values.duration});
  }
  function setExpectedDuration(duration: number): void {
    setValues({name: values.name, dueDate: values.dueDate, priority: new Set(values.priority), duration: duration});
  }

  function createItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const priority = (values.priority != 'all' && values.priority.keys().next().value) || 'Low';

    values.dueDate?.setHours(23, 59, 59, 0);
    const newItem = { ...values, sectionId, priority, sectionIndex: nextIndex };
    if(!hasTimeTracking)
      delete newItem.duration;
    if(!hasDueDates)
      delete newItem.dueDate;

    api.post('/item', newItem)
      .then(res => {
        setValues(startingInputValues);

        const id = res.content?.split('/').at(-1);
        const item = new ListItem(values.name, { priority, expectedMs: newItem.duration, sectionIndex: nextIndex, dateDue: newItem.dueDate, id });
        addItem(item);

        setIsSliderOpen(false);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <span>
      <span className='hidden lg:flex justify-between items-center overflow-y-visible'>
        <span className='overflow-x-clip'>
          <form onSubmit={createItem} className={`flex gap-4 pr-4 transition-transform${isSliderOpen ? '' : ' translate-x-full'}`}>
            <Input 
              label='Name'
              placeholder='Add item...' 
              value={values.name}
              onValueChange={setName}
              ref={input => focusInput.current = input }
              variant='underlined' 
              size='sm' 
              tabIndex={isSliderOpen ? 0 : 1} 
              className='w-44 -mt-2' 
              classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
            />
            {
              hasDueDates
                ? (
                  <DateInput2 
                    label='Due' 
                    value={values.dueDate}
                    onValueChange={setDueDate}
                    variant='underlined' 
                    color='primary'
                    size='sm'
                    tabIndex={isSliderOpen ? 0 : 1} 
                    className='w-24 -mt-4'
                    classNames={{label: '-pb-1', inputWrapper: 'border-foreground/50'}}
                  />
                )
                : <></>
            }
            <Select
              variant='underlined' 
              labelPlacement='outside' 
              size='sm' 
              className={'w-28 -mt-4'}
              label={<span className='ml-2 text-foreground'>Priority</span>}
              classNames={{trigger: `${(values.priority == 'all' || values.priority.has('High')) ? 'border-danger' : values.priority.has('Medium') ? 'border-warning' : 'border-success'}`, mainWrapper: '-mt-6'}}
              placeholder='Select...' 
              tabIndex={isSliderOpen ? 0 : 1} 
              selectedKeys={values.priority}
              onSelectionChange={setPriority}
              color={`${(values.priority == 'all' || values.priority.has('High')) ? 'danger' : values.priority.has('Medium') ? 'warning' : values.priority.has('Low') ? 'success' : 'default'}`}
            >
              <SelectItem key='High' value='High' color='danger'>High</SelectItem>
              <SelectItem key='Medium' value='Medium' color='warning'>Medium</SelectItem>
              <SelectItem key='Low' value='Low' color='success'>Low</SelectItem>
            </Select>
            {
              hasTimeTracking
                ? (
                  <TimeInput 
                    label='Time'
                    value={values.duration}
                    onValueChange={setExpectedDuration}
                    variant='underlined' 
                    size='sm'
                    tabIndex={isSliderOpen ? 0 : 1} 
                    className='w-12 -mt-2'
                    classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
                  />
                )
                : <></>
            }
            <Button type='submit' tabIndex={isSliderOpen ? 0 : 1} variant='ghost' isIconOnly color='primary'><Check size={'1.25em'} /></Button>
          </form>
        </span>
        <Button tabIndex={0} variant='ghost' isIconOnly onPress={() => { setIsSliderOpen(!isSliderOpen); if (isSliderOpen) setValues(startingInputValues); }} color={isSliderOpen ? 'danger' : 'primary'}><Plus size={'1.5em'} className={`transition-transform ${isSliderOpen ? ' -rotate-45' : ''}`}/></Button>
      </span>
      <span className='flex lg:hidden'>
        <Button tabIndex={0} variant='ghost' isIconOnly onPress={onModalOpen} color='primary'><Plus size={'1.5em'}/></Button>
        <Modal isOpen={isModalOpen} onOpenChange={onModalOpenChange}>
          <ModalContent>
            {
              onClose => (
                <>
                  <ModalHeader className='justify-center'>Add Item</ModalHeader>
                    <form onSubmit={createItem}>
                      <ModalBody className={`flex flex-row justify-center gap-4`}>
                        <Input 
                          label='Name'
                          placeholder='Add item...' 
                          value={values.name}
                          onValueChange={setName}
                          autoFocus
                          variant='underlined' 
                          size='sm' 
                          className='w-44 -mt-2' 
                          classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
                        />
                        {
                          hasDueDates
                            ? (
                              <DateInput2 
                                label='Due' 
                                value={values.dueDate}
                                onValueChange={setDueDate}
                                variant='underlined' 
                                color='primary'
                                size='sm'
                                className='w-24 -mt-4'
                                classNames={{label: '-pb-1', inputWrapper: 'border-foreground/50'}}
                              />
                            )
                            : <></>
                        }
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
                        {
                          hasTimeTracking
                            ? (
                              <TimeInput 
                                label='Time'
                                value={values.duration}
                                onValueChange={setExpectedDuration}
                                variant='underlined' 
                                size='sm'
                                autoFocus={false} 
                                className='w-12 -mt-2'
                                classNames={{label: 'pb-1', inputWrapper: 'border-foreground/50'}}
                              />
                            )
                            : <></>
                        }
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                          Cancel
                        </Button>
                        <Button type='submit' color="primary" onPress={onClose}>
                          Add
                        </Button>
                      </ModalFooter>
                    </form>
                </>
              )
            }
          </ModalContent>
        </Modal>
      </span>
    </span>
  );
}