import { getListById, getTagsByListId } from '@/lib/database/list';
import List from './list';

export default async function Page({ params }: { params: { id: string } }) {
  const list = await getListById(params.id);
  const tagsAvailable = await getTagsByListId(params.id);

  return (
    <main className='p-8 w-full flex flex-col gap-8'>
      {list && <List startingList={JSON.stringify(list)} startingTagsAvailable={JSON.stringify(tagsAvailable)} />}
    </main>
  );
}