import { authorize } from "@/lib/security/authorize";
import { Checkbox } from "@nextui-org/react";
import { ReactNode } from "react";

export default async function Page() {
  await authorize();

  return (
    <div className='p-8 w-full'>
      <List name='Phase 1'>
        <ListItem text='Plant a garden' />
        <ListItem text='Harvest tomatoes' />
      </List>
    </div>
  );
}

function List({ name, children }: { name: string, children: ReactNode }) {
  return (
    <div className='rounded-md w-100 overflow-hidden border-1 border-content3 box-border'>
      <div className='bg-content3 font-bold p-4'>
        {name}
      </div>
      {children}
    </div>
  )
}

function ListItem({ text }: { text: string }) {
  return (
    <div className='border-b-1 border-content3 p-4'>
      <Checkbox className='mr-0' />
      <span className='text-sm'>
        {text}
      </span>
    </div>
  );
}