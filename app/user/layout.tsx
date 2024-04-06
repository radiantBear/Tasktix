import { authorize } from "@/lib/security/authorize";
import Sidebar from "./sidebar";
import { getListsByUser } from "@/lib/database/list";
import { getUser } from "@/lib/session";

export default async function UserLayout({children}: Readonly<{children: React.ReactNode}>) {
  await authorize();

  const user = await getUser();
  /* Just need this for TypeScript */
  if(!user)
  return <></>;

  const lists = await getListsByUser(user.id) || [];

  return (
    <div className='flex h-100 grow'>
      <Sidebar startingLists={JSON.stringify(lists)} />
      {children}
    </div>
  );
}