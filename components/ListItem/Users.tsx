import Assignee from '@/lib/model/assignee';
import { Avatar, AvatarGroup, Button, Card, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useState } from 'react';
import { PeopleFill, Plus, X } from 'react-bootstrap-icons';
import { getBackgroundColor, getTextColor } from '@/lib/color';
import ListMember from '@/lib/model/listMember';
import { api } from '@/lib/api';
import { addSnackbar } from '../Snackbar';

export default function Users({ itemId, assignees, members, isComplete, className }: { itemId: string, assignees: Assignee[], members: ListMember[], isComplete: boolean, className?: string }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [_assignees, setAssignees] = useState(assignees);

  function addAssignee(userId: string) {
    api.post(`/item/${itemId}/assignee/${userId}`, {})
      .then(res => {
        addSnackbar(res.message, 'success');
        const newAssignees = structuredClone(_assignees);
        for(const member of members)
          if(member.user.id == userId)
            newAssignees.push(new Assignee(member.user, ''));
        setAssignees(newAssignees);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function removeAssignee(userId: string) {
    api.delete(`/item/${itemId}/assignee/${userId}`)
      .then(res => {
        addSnackbar(res.message, 'success');
        const newAssignees = structuredClone(_assignees);
        for(let i = 0; i < newAssignees.length; i++)
          if(newAssignees[i].user.id == userId)
            newAssignees.splice(i, 1);
        setAssignees(newAssignees);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  
  return (
    <Popover placement='bottom' isOpen={isPopoverOpen} onOpenChange={open => {if(!isComplete) setIsPopoverOpen(open)}}>
      <PopoverTrigger>
        <Card tabIndex={isComplete ? 1 : 0} className={`px-4 basis-1/6 grow shrink flex flex-row items-center justify-start overflow-hidden flex-nowrap h-10 shadow-none cursor-pointer ${isComplete ? 'opacity-50 cursor-default' : 'hover:bg-foreground/10 focus:z-10 focus:outline-2 focus:outline-focus focus:outline-offset-2'} ${className}`}>
          <PeopleFill className='shrink-0' />
          <AvatarGroup max={4}  className={`ml-4 ${isComplete ? 'opacity-50' : ''}`}>
            {_assignees.map(assignee => 
              <Avatar key={assignee.user.id} name={assignee.user.username ?? ''} classNames={{base: getBackgroundColor(assignee.user.color)}} size='sm' />
            )}
          </AvatarGroup>
        </Card>
      </PopoverTrigger>
      <PopoverContent className='w-52'>
        {
          _assignees.map(assignee => (
            <div key={assignee.user.id} className={`${assignee.user.color ? getTextColor(assignee.user.color) : null} flex justify-between items-center w-full p-1.5`}>
              {assignee.user.username}
              <Button onPress={removeAssignee.bind(null, assignee.user.id)} variant='flat' color='danger' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><X /></Button>
            </div>
          ))
        }
        {
          members.map(member => {
            if(!_assignees.some(assignee => assignee.user.id == member.user.id))
              return (
                <div key={member.user.id} className={`${getTextColor(member.user.color)} flex justify-between items-center w-full p-1.5`}>
                  {member.user.username}
                  <Button onPress={addAssignee.bind(null, member.user.id)} variant='flat' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><Plus /></Button>
                </div>
              );
          })
        }
      </PopoverContent>
    </Popover>
  );
}