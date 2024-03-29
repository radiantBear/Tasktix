import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { CalendarEventFill, PeopleFill, Tags, ThreeDots, TrashFill } from 'react-bootstrap-icons';

export default function More() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='ghost' isIconOnly><ThreeDots /></Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key='assign' startContent={<PeopleFill />}>Update assignees</DropdownItem>
        <DropdownItem key='tag' startContent={<Tags />}>Update tags</DropdownItem>
        <DropdownItem key='tag' startContent={<CalendarEventFill />} className='text-warning' color='warning'>Change due date</DropdownItem>
        <DropdownItem key='remove' startContent={<TrashFill />} className='text-danger' color='danger'>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}