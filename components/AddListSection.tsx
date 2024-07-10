'use client';

import { api } from "@/lib/api";
import { Button, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { addSnackbar } from "./Snackbar";
import ListSection from "@/lib/model/listSection";

export default function AddListSection({ listId, addListSection }: { listId: string, addListSection: (_: ListSection) => any }) {
  const [name, setName] = useState('');
  
  function createSection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api.post(`/list/${listId}/section`, { name })
      .then(res => {
        const id = res.content?.split('/').at(-1);
        addListSection(new ListSection(name, [], id));
        setName('');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  return (
    <form onSubmit={createSection} className='rounded-md w-100 overfLow-hidden border-1 border-content3 bg-content1 p-4 h-18 flex items-center justify-center gap-4 shadow-lg shadow-content2'>
      <Input placeholder='Name' value={name} onValueChange={setName} variant='underlined' className='w-52' />
      <Button type='submit' tabIndex={0} variant='flat' color='primary'>Add Section</Button>
    </form>
  );
}