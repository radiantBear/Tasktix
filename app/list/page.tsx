import ListItemGroup from '@/components/ListItemGroup';
import {
  getListMembersByUser,
  getListsByUser,
  getTagsByUser
} from '@/lib/database/list';
import { getListItemsByUser } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export default async function Page() {
  const user = await getUser();

  const lists = await getListsByUser(user ? user.id : '');
  const items = await getListItemsByUser(user ? user.id : '');
  const tags = await getTagsByUser(user ? user.id : '');
  const members = await getListMembersByUser(user ? user.id : '');

  return (
    <main className='p-8 w-full flex flex-col gap-8 overflow-y-scroll'>
      <ListItemGroup
        alternate="You're all caught up!"
        members={JSON.stringify(members)}
        startingItems={JSON.stringify(items)}
        startingLists={JSON.stringify(lists)}
        startingTags={JSON.stringify(tags)}
      />
    </main>
  );
}
