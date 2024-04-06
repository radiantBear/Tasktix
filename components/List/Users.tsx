import Assignee from '@/lib/model/assignee';
import { Avatar, AvatarGroup } from '@nextui-org/react';


export default function Users({ assignees, isComplete }: { assignees: Assignee[], isComplete: boolean }) {
  return (
    <AvatarGroup max={4}  className={isComplete ? 'opacity-50' : ''}>
      {assignees.map(assignee => {
        let color: string;
        switch(assignee.color) {
          case 'Pink':
            color = 'bg-pink-500';
            break;
          case 'Red':
            color = 'bg-red-500';
            break;
          case 'Orange':
            color = 'bg-orange-500';
            break;
          case 'Amber':
            color = 'bg-amber-500';
            break;
          case 'Yellow':
            color = 'bg-yellow-500';
            break;
          case 'Lime':
            color = 'bg-lime-500';
            break;
          case 'Green':
            color = 'bg-green-500';
            break;
          case 'Emerald':
            color = 'bg-emerald-500';
            break;
          case 'Cyan':
            color = 'bg-cyan-500';
            break;
          case 'Blue':
            color = 'bg-blue-500';
            break;
          case 'Violet':
            color = 'bg-violet-500';
            break;
        }

        return <Avatar key={assignee.user.id} name={assignee.user.username ?? ''} classNames={{base: color}} size='sm' />
      })}
    </AvatarGroup>
  );
}