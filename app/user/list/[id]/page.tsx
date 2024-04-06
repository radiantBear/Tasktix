import { getIsListAssignee, getListById, getTagsByListId } from '@/lib/database/list';
import List from '@/components/List';
import { getUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const list = await getListById(params.id);
  const tagsAvailable = await getTagsByListId(params.id);

  const user = await getUser();
  if(!list || !user)
    redirect('/user');
  const isMember = await getIsListAssignee(user.id, list.id);
  if(!isMember)
    redirect('/user');

  return (
    <main className='p-8 w-full flex flex-col gap-8'>
      {list && <List startingList={JSON.stringify(list)} startingTagsAvailable={JSON.stringify(tagsAvailable)} />}
    </main>
  );
}