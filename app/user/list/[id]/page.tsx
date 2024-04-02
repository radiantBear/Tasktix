import { AddListSection, ListSection } from '@/components/ListSection';
import { getListById } from '@/lib/database/list';

export default async function Page({ params }: { params: { id: string } }) {
  const list = await getListById(params.id);
  
  console.log(list)

  return (
    <main className='p-8 w-full flex flex-col gap-8'>
      {list && list.sections.map(section => <ListSection key={section.id} name={section.name} listItems={[]} />)}
      {/* <ListSection name='Phase 1' listItems={[
        {id: '1', name: 'Plant a garden', dateDue: new Date(), status: 'Completed', priority: 'High', needsClarification: false, tags: [{id: '1', name: 'Planting', color: 'Lime'}, {id: '2', name: 'Outdoors', color: 'Cyan'}, {id: '3', name: 'Fun', color: 'Pink'}, {id: '4', name: 'One time', color: 'Emerald'}], expectedDuration: sixMin, elapsedDuration: fiveMin, assignees: [assignees[0]]},
        {id: '2', name: 'Water the garden', dateDue: tomorrow, status: 'Unstarted', priority: 'Low', needsClarification: false, tags: [{id: '2', name: 'Outdoors', color: 'Cyan'}], expectedDuration: fiveMin, elapsedDuration: zeroMin, assignees},
      ]} /> */}
      <AddListSection listId={params.id} />
    </main>
  );
}