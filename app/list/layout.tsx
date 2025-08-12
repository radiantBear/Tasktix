import { authorize } from '@/lib/security/authorize';
import { getListsByUser } from '@/lib/database/list';
import { getUser } from '@/lib/session';

import LayoutClient from './layoutClient';

export default async function UserLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  await authorize();

  const user = await getUser();

  /* Just need this for TypeScript */
  if (!user) return <></>;

  const lists = (await getListsByUser(user.id)) || [];

  return (
    <LayoutClient startingLists={JSON.stringify(lists)}>
      {children}
    </LayoutClient>
  );
}
