'use client';

import { setTimeout } from 'timers';

import { ReactNode, useContext, useState } from 'react';
import { Button, Input, Link } from '@nextui-org/react';
import { Check, Plus } from 'react-bootstrap-icons';
import { usePathname, useRouter } from 'next/navigation';

import { default as api } from '@/lib/api';
import { addSnackbar } from '@/components/Snackbar';
import { validateListName } from '@/lib/validate';
import List from '@/lib/model/list';
import { randomNamedColor } from '@/lib/color';

import { ListContext } from './listContext';

export default function Sidebar({ lists }: { lists: List[] }) {
  const [addingList, setAddingList] = useState(false);
  const router = useRouter();
  const dispatchEvent = useContext(ListContext);

  function finalizeNew(name: string) {
    const color = randomNamedColor();

    api
      .post('/list', { name, color })
      .then(res => {
        const id = res.content?.split('/').at(-1);

        if (!id) {
          addSnackbar('No list ID returned', 'error');

          return;
        }
        router.push(`${res.content}`);
        dispatchEvent({ type: 'add', id, name, color });
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  async function removeNew() {
    function delay(ms: number) {
      return new Promise(res => setTimeout(res, ms));
    }

    await delay(100);
    setAddingList(false);
  }

  return (
    <aside className='w-48 bg-transparent shadow-l-lg shadow-content4 p-4 pr-0 flex flex-col gap-4 overflow-y-scroll'>
      <NavItem link='/list' name='Today' />
      <NavSection
        endContent={<AddList addList={() => setAddingList(true)} />}
        name='Lists'
      >
        {lists
          .sort((a, b) => (a.name > b.name ? 1 : 0))
          .map(list => (
            <NavItem key={list.id} link={`/list/${list.id}`} name={list.name} />
          ))}
        {addingList ? (
          <NewItem finalize={finalizeNew} remove={removeNew} />
        ) : (
          <></>
        )}
      </NavSection>
    </aside>
  );
}

function NavSection({
  name,
  endContent,
  children
}: {
  name: string;
  endContent?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center text-xs'>
        {name} {endContent}
      </div>
      <div className='pl-2 flex flex-col'>{children}</div>
    </div>
  );
}

export function NavItem({
  name,
  link,
  endContent
}: {
  name: string;
  link: string;
  endContent?: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname == link;

  return (
    <span
      className={`pl-2 my-1 flex items-center justify-between border-l-2${isActive ? ' border-primary' : ' border-transparent'} text-sm`}
    >
      <Link color='foreground' href={link}>
        {name}
      </Link>
      {endContent}
    </span>
  );
}

function AddList({ addList }: { addList: () => unknown }) {
  return (
    <Button
      isIconOnly
      className='border-0 text-foreground rounded-lg w-8 h-8 min-w-8 min-h-8'
      color='primary'
      variant='ghost'
      onPress={addList}
    >
      <Plus size={'1.25em'} />
    </Button>
  );
}

function NewItem({
  finalize,
  remove
}: {
  finalize: (name: string) => unknown;
  remove: () => unknown;
}) {
  const [name, setName] = useState('');

  function updateName(name: string) {
    setName(validateListName(name)[1]);
  }

  return (
    <form
      className={`pl-1 flex items-center justify-between gap-2 text-sm`}
      onSubmit={e => {
        e.preventDefault();
        finalize(name);
      }}
    >
      <Input
        autoFocus
        color='primary'
        placeholder='List name'
        size='sm'
        value={name}
        variant='underlined'
        onBlur={remove}
        onValueChange={updateName}
      />
      <Button
        isIconOnly
        className='rounded-lg w-8 h-8 min-w-8 min-h-8'
        color='primary'
        type='submit'
        variant='ghost'
      >
        <Check />
      </Button>
    </form>
  );
}
