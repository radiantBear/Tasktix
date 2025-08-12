'use client';

import { Button, Input } from '@nextui-org/react';
import { FormEvent, useState } from 'react';

import api from '@/lib/api';
import ListSection from '@/lib/model/listSection';

import { addSnackbar } from './Snackbar';

export default function AddListSection({
  listId,
  addListSection
}: {
  listId: string;
  addListSection: (_: ListSection) => any;
}) {
  const [name, setName] = useState('');

  function createSection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api
      .post(`/list/${listId}/section`, { name })
      .then(res => {
        const id = res.content?.split('/').at(-1);

        addListSection(new ListSection(name, [], id));
        setName('');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <form
      className='rounded-md w-100 overfLow-hidden border-2 border-content3 bg-content1 p-4 h-18 flex items-center justify-center gap-4 shadow-lg shadow-content2'
      onSubmit={createSection}
    >
      <Input
        className='w-52'
        placeholder='Name'
        value={name}
        variant='underlined'
        onValueChange={setName}
      />
      <Button color='primary' tabIndex={0} type='submit' variant='flat'>
        Add Section
      </Button>
    </form>
  );
}
