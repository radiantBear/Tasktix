import { authorize } from "@/lib/security/authorize";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Sliders2, StopwatchFill, CalendarMinus, SortUpAlt } from "react-bootstrap-icons";
import Sidebar, { NavItem } from "./sidebar";
import { getListsByUser } from "@/lib/database/list";
import { getUser } from "@/lib/session";

export default async function UserLayout({children}: Readonly<{children: React.ReactNode}>) {
  await authorize();

  const user = await getUser();
  
  /* Just need this for TypeScript */
  if(!user)
    return <></>;
  const lists = await getListsByUser(user.id);
  if(!lists)
    return <></>;

  return (
    <div className='flex h-100 grow'>
      <Sidebar>
        {lists.map(list => <NavItem key={list.id} name={list.name} link={`/user/list/${list.id}`} isActive={true} endContent={<ListSettings />} />)}
      </Sidebar>
      {children}
    </div>
  );
}

function ListSettings() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button type='button' color='primary' isIconOnly variant='ghost' className='border-0 text-foreground rounded-lg w-8 h-8 min-w-8 min-h-8'>
          <Sliders2 />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key='toggleTime' startContent={<StopwatchFill />}>No time tracking</DropdownItem>
        <DropdownItem key='toggleDueDate' startContent={<CalendarMinus />}>No due dates</DropdownItem>
        <DropdownItem key='sortCompleted' startContent={<SortUpAlt />}>Sort completed ascending</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}