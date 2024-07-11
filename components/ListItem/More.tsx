import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import { ThreeDots, TrashFill } from 'react-bootstrap-icons';
import DateInput2 from '../DateInput2';
import Name from './Name';
import Priority from './Priority';
import Tags from './Tags';
import Users from './Users';
import ExpectedInput from './ExpectedInput';
import ElapsedInput from './ElapsedInput';
import TimeButton from './TimeButton';
import Color from '@/lib/model/color';
import ListItem from '@/lib/model/listItem';
import Tag from '@/lib/model/tag';
import ListMember from '@/lib/model/listMember';

interface SetItem {
  name: (name: string) => void,
  dueDate: (date: Date) => void,
  priority: (priority: ListItem['priority']) => void,
  complete: () => void,
  incomplete: () => void,
  expectedMs: (ms: number) => void,
  startedRunning: () => void,
  pausedRunning: () => void,
  resetTime: () => void,
  linkedTag: (id: string, name?: string, color?: Color) => void,
  unlinkedTag: (id: string) => void,
  deleted: () => void
}

export default function More({ item, tags, tagsAvailable, members, hasDueDates, hasTimeTracking, elapsedLive, set, addNewTag }: { item: ListItem, tags: Tag[], tagsAvailable: Tag[], members: ListMember[], hasDueDates: boolean, hasTimeTracking: boolean, elapsedLive: number, set: SetItem, addNewTag: (name: string, color: Color) => any }) {
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
                  <Checkbox tabIndex={0} isSelected={isComplete} onChange={e => { e.target.checked ? set.complete() : set.incomplete(); }} />
                  <span className='flex grow'>
                    <Name showLabel name={item.name} updateName={set.name} disabled={isComplete} />
                  </span>
                </div>
                <div className='flex gap-4 items-center'>
                  <Priority isComplete={isComplete} priority={item.priority} wrapperClassName='!my-0 w-1/2' className='w-full' setPriority={set.priority} />
                  {
                    hasDueDates 
                      ? (
                        <DateInput2 disabled={isComplete} label='Due date' value={item.dateDue || undefined} onValueChange={set.dueDate} color='primary' variant='underlined' className='w-1/2' />
                      )
                      : <></>
                  }
                </div>

                <Tags tags={tags} tagsAvailable={tagsAvailable} isComplete={item.status == 'Completed'} addNewTag={addNewTag} linkTag={set.linkedTag} unlinkTag={set.unlinkedTag} className='py-2' />

                {
                  members.length > 1
                    ? <Users itemId={item.id} assignees={item.assignees} members={members} isComplete={isComplete} className='py-2' />
                    : <></>
                }

                <div className='flex gap-6 justify-end'>
                  {
                    hasTimeTracking
                      ? (
                        <>
                          <span className={`flex gap-6 ${isComplete ? 'opacity-50' : ''}`}>
                            <ExpectedInput ms={item.expectedMs} disabled={isComplete} updateMs={set.expectedMs} />
                            <span className='border-r-1 border-content3'></span>
                            <ElapsedInput ms={elapsedLive} disabled={isComplete} resetTime={set.resetTime} />
                          </span>
                          <TimeButton status={item.status} startRunning={set.startedRunning} pauseRunning={set.pausedRunning} />  
                        </>
                      )
                      : <></>
                  }
                  <Button onPress={() => { onClose(); set.deleted(); }} variant='ghost' color='danger'>
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