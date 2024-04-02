'use client';

import User from '@/lib/model/user';
import Assignee from '@/lib/model/assignee';
import { ListSection } from '@/components/ListSection';

export default function Page() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const user = new User();
  user.username = 'radiantBear';
  const user2 = new User();
  user2.username = 'Bill Jones';
  const user3 = new User();
  user3.username = 'Josh Hawley';
  const user4 = new User();
  user4.username = 'Rick Jones';
  const user5 = new User();
  user5.username = 'Jeff Bezos';
  const assignees: Assignee[] = [
    {
      user,
      role: 'Editor',
      color: 'Amber'
    },
    {
      user: user2,
      role: 'Editor',
      color: 'Orange'
    },
    {
      user: user3,
      role: 'Editor',
      color: 'Pink'
    },
    {
      user: user4,
      role: 'Editor',
      color: 'Yellow'
    },
    {
      user: user5,
      role: 'Editor',
      color: 'Yellow'
    }
  ];

  const zeroMin = new Date();
  zeroMin.setTime(0);
  const fiveMin = new Date();
  fiveMin.setTime(5000*60);
  const sixMin = new Date();
  sixMin.setTime(6000*60);

  return (
    <main className='p-8 w-full flex flex-col gap-8'>
      <ListSection name='Phase 1' listItems={[
        {id: '1', name: 'Plant a garden', dateDue: new Date(), status: 'Completed', priority: 'High', needsClarification: false, tags: [{id: '1', name: 'Planting', color: 'Lime'}, {id: '2', name: 'Outdoors', color: 'Cyan'}, {id: '3', name: 'Fun', color: 'Pink'}, {id: '4', name: 'One time', color: 'Emerald'}], expectedDuration: sixMin, elapsedDuration: fiveMin, assignees: [assignees[0]]},
        {id: '2', name: 'Water the garden', dateDue: tomorrow, status: 'Unstarted', priority: 'Low', needsClarification: false, tags: [{id: '2', name: 'Outdoors', color: 'Cyan'}], expectedDuration: fiveMin, elapsedDuration: zeroMin, assignees},
      ]} />
    </main>
  );
}