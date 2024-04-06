import ListItemGroup from "@/components/ListItemGroup";
import { getListItemsByUser } from "@/lib/database/listItem";
import { getUser } from "@/lib/session";

export default async function Page() {
  const user = await getUser();

  const items = await getListItemsByUser(user ? user.id : '');

  return (
    <main className='p-8 w-full flex flex-col gap-8'>
      <ListItemGroup startingItems={JSON.stringify(items)} />
    </main>
  );
}