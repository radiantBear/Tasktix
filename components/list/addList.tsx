import { Button, Input } from "@nextui-org/react";

export default function AddList() {
  return (
    <div className='rounded-md w-100 overfLow-hidden border-1 border-content3 bg-content1 p-4 h-18 flex items-center justify-center gap-4'>
      <Input className='w-52' placeholder='Name' variant='underlined' />
      <Button variant='flat' color='primary'>Add Section</Button>
    </div>
  );
}