import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Selection,
  useDisclosure
} from '@nextui-org/react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Check, Plus } from 'react-bootstrap-icons';

import { default as api } from '@/lib/api';
import { addSnackbar } from '@/components/Snackbar';
import ListItem from '@/lib/model/listItem';

import TimeInput from '../TimeInput';
import DateInput2 from '../DateInput2';

export default function AddItem({
  sectionId,
  hasTimeTracking,
  hasDueDates,
  nextIndex,
  addItem
}: {
  sectionId: string;
  hasTimeTracking: boolean;
  hasDueDates: boolean;
  nextIndex: number;
  addItem: (_: ListItem) => any;
}) {
  const zeroMin = new Date();

  zeroMin.setTime(0);
  const startingInputValues = {
    name: '',
    dueDate: new Date(),
    priority: new Set(['Low']),
    duration: 0
  };

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onOpenChange: onModalOpenChange
  } = useDisclosure();
  const [values, setValues] = useState<{
    name: string;
    dueDate?: Date;
    priority: Selection;
    duration?: number;
  }>(startingInputValues);
  const focusInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSliderOpen) focusInput.current?.focus();
  }, [isSliderOpen]);

  function setName(name: string): void {
    setValues({
      name,
      dueDate: values.dueDate,
      priority: new Set(values.priority),
      duration: values.duration
    });
  }
  function setDueDate(date: Date): void {
    setValues({
      name: values.name,
      dueDate: date,
      priority: new Set(values.priority),
      duration: values.duration
    });
  }
  function setPriority(priority: Selection): void {
    setValues({
      name: values.name,
      dueDate: values.dueDate,
      priority,
      duration: values.duration
    });
  }
  function setExpectedDuration(duration: number): void {
    setValues({
      name: values.name,
      dueDate: values.dueDate,
      priority: new Set(values.priority),
      duration: duration
    });
  }

  function createItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const priorityKey =
      (values.priority != 'all' && values.priority.keys().next().value) ||
      'Low';
    const priority =
      priorityKey == 'High'
        ? 'High'
        : priorityKey == 'Medium'
          ? 'Medium'
          : 'Low';

    values.dueDate?.setHours(23, 59, 59, 0);
    const newItem = { ...values, sectionId, priority, sectionIndex: nextIndex };

    if (!hasTimeTracking) delete newItem.duration;
    if (!hasDueDates) delete newItem.dueDate;

    api
      .post('/item', newItem)
      .then(res => {
        setValues(startingInputValues);

        const id = res.content?.split('/').at(-1);
        const item = new ListItem(values.name, {
          priority,
          expectedMs: newItem.duration,
          sectionIndex: nextIndex,
          dateDue: newItem.dueDate,
          id
        });

        addItem(item);

        setIsSliderOpen(false);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <span>
      <span className='hidden lg:flex justify-between items-center overflow-y-visible'>
        <span className='overflow-x-clip'>
          <form
            className={`flex gap-4 pr-4 transition-transform${isSliderOpen ? '' : ' translate-x-full'}`}
            onSubmit={createItem}
          >
            <Input
              ref={input => {
                focusInput.current = input;
              }}
              className='w-44 -mt-2'
              classNames={{
                label: 'pb-1',
                inputWrapper: 'border-foreground/50'
              }}
              label='Name'
              placeholder='Add item...'
              size='sm'
              tabIndex={isSliderOpen ? 0 : 1}
              value={values.name}
              variant='underlined'
              onValueChange={setName}
            />
            {hasDueDates ? (
              <DateInput2
                className='w-24 -mt-4'
                classNames={{
                  label: '-pb-1',
                  inputWrapper: 'border-foreground/50'
                }}
                color='primary'
                label='Due'
                size='sm'
                tabIndex={isSliderOpen ? 0 : 1}
                value={values.dueDate}
                variant='underlined'
                onValueChange={setDueDate}
              />
            ) : (
              <></>
            )}
            <Select
              className={'w-28 -mt-4'}
              classNames={{
                trigger: `${values.priority == 'all' || values.priority.has('High') ? 'border-danger' : values.priority.has('Medium') ? 'border-warning' : 'border-success'}`,
                mainWrapper: '-mt-6'
              }}
              color={`${values.priority == 'all' || values.priority.has('High') ? 'danger' : values.priority.has('Medium') ? 'warning' : values.priority.has('Low') ? 'success' : 'default'}`}
              label={<span className='ml-2 text-foreground'>Priority</span>}
              labelPlacement='outside'
              placeholder='Select...'
              selectedKeys={values.priority}
              size='sm'
              tabIndex={isSliderOpen ? 0 : 1}
              variant='underlined'
              onSelectionChange={setPriority}
            >
              <SelectItem key='High' color='danger' value='High'>
                High
              </SelectItem>
              <SelectItem key='Medium' color='warning' value='Medium'>
                Medium
              </SelectItem>
              <SelectItem key='Low' color='success' value='Low'>
                Low
              </SelectItem>
            </Select>
            {hasTimeTracking ? (
              <TimeInput
                className='w-12 -mt-2'
                classNames={{
                  label: 'pb-1',
                  inputWrapper: 'border-foreground/50'
                }}
                label='Time'
                size='sm'
                tabIndex={isSliderOpen ? 0 : 1}
                value={values.duration}
                variant='underlined'
                onValueChange={setExpectedDuration}
              />
            ) : (
              <></>
            )}
            <Button
              isIconOnly
              color='primary'
              tabIndex={isSliderOpen ? 0 : 1}
              type='submit'
              variant='ghost'
            >
              <Check size={'1.25em'} />
            </Button>
          </form>
        </span>
        <Button
          isIconOnly
          color={isSliderOpen ? 'danger' : 'primary'}
          tabIndex={0}
          variant='ghost'
          onPress={() => {
            setIsSliderOpen(!isSliderOpen);
            if (isSliderOpen) setValues(startingInputValues);
          }}
        >
          <Plus
            className={`transition-transform ${isSliderOpen ? ' -rotate-45' : ''}`}
            size={'1.5em'}
          />
        </Button>
      </span>
      <span className='flex lg:hidden'>
        <Button
          isIconOnly
          color='primary'
          tabIndex={0}
          variant='ghost'
          onPress={onModalOpen}
        >
          <Plus size={'1.5em'} />
        </Button>
        <Modal isOpen={isModalOpen} onOpenChange={onModalOpenChange}>
          <ModalContent>
            {onClose => (
              <>
                <ModalHeader className='justify-center'>Add Item</ModalHeader>
                <form onSubmit={createItem}>
                  <ModalBody className={`flex flex-row justify-center gap-4`}>
                    <Input
                      autoFocus
                      className='w-44 -mt-2'
                      classNames={{
                        label: 'pb-1',
                        inputWrapper: 'border-foreground/50'
                      }}
                      label='Name'
                      placeholder='Add item...'
                      size='sm'
                      value={values.name}
                      variant='underlined'
                      onValueChange={setName}
                    />
                    {hasDueDates ? (
                      <DateInput2
                        className='w-24 -mt-4'
                        classNames={{
                          label: '-pb-1',
                          inputWrapper: 'border-foreground/50'
                        }}
                        color='primary'
                        label='Due'
                        size='sm'
                        value={values.dueDate}
                        variant='underlined'
                        onValueChange={setDueDate}
                      />
                    ) : (
                      <></>
                    )}
                    <Select
                      className={'w-28 -mt-4'}
                      classNames={{
                        trigger: `${values.priority == 'all' || values.priority.has('High') ? 'border-danger' : values.priority.has('Medium') ? 'border-warning' : 'border-success'}`,
                        mainWrapper: '-mt-6'
                      }}
                      color={`${values.priority == 'all' || values.priority.has('High') ? 'danger' : values.priority.has('Medium') ? 'warning' : values.priority.has('Low') ? 'success' : 'default'}`}
                      label={
                        <span className='ml-2 text-foreground'>Priority</span>
                      }
                      labelPlacement='outside'
                      placeholder='Select...'
                      selectedKeys={values.priority}
                      size='sm'
                      variant='underlined'
                      onSelectionChange={setPriority}
                    >
                      <SelectItem key='High' color='danger' value='High'>
                        High
                      </SelectItem>
                      <SelectItem key='Medium' color='warning' value='Medium'>
                        Medium
                      </SelectItem>
                      <SelectItem key='Low' color='success' value='Low'>
                        Low
                      </SelectItem>
                    </Select>
                    {hasTimeTracking ? (
                      <TimeInput
                        autoFocus={false}
                        className='w-12 -mt-2'
                        classNames={{
                          label: 'pb-1',
                          inputWrapper: 'border-foreground/50'
                        }}
                        label='Time'
                        size='sm'
                        value={values.duration}
                        variant='underlined'
                        onValueChange={setExpectedDuration}
                      />
                    ) : (
                      <></>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color='danger' variant='light' onPress={onClose}>
                      Cancel
                    </Button>
                    <Button color='primary' type='submit' onPress={onClose}>
                      Add
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </span>
    </span>
  );
}
