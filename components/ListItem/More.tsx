import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { CalendarEventFill, PeopleFill, StopwatchFill, ThreeDots, TrashFill } from 'react-bootstrap-icons';

export default function More({ deleteItem }: { deleteItem: () => any }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='ghost' isIconOnly><ThreeDots /></Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key='assign' startContent={<PeopleFill />}>Update assignees</DropdownItem>
        <DropdownItem key='updateExpectedDuration' startContent={<StopwatchFill />}>Updated expected duration</DropdownItem>
        <DropdownItem key='updateDueDate' startContent={<CalendarEventFill />} className='text-warning' color='warning'>Change due date</DropdownItem>
        <DropdownItem key='remove' onPress={deleteItem} startContent={<TrashFill />} className='text-danger' color='danger'>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}