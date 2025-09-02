import { redirect } from 'next/navigation';

import {
  getIsListAssignee,
  getListById,
  getTagsByListId
} from '@/lib/database/list';
import List from '@/components/List';
import { getUser } from '@/lib/session';

export default async function Page({ params }: { params: { id: string } }) {
  const list = await getListById(params.id);
  const tagsAvailable = await getTagsByListId(params.id);

  const user = await getUser();

  if (!list || !user) redirect('/list');

  const isMember = await getIsListAssignee(user.id, list.id);

  if (!isMember) redirect('/list');

  return (
    <main className='p-8 w-full flex flex-col gap-8 overflow-y-scroll'>
      {list && (
        <List
          startingList={JSON.stringify(list)}
          startingTagsAvailable={JSON.stringify(tagsAvailable || [])}
        />
      )}
    </main>
  );
}
