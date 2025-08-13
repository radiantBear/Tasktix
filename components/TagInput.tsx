import { FormEvent, useState } from 'react';
import { Check } from 'react-bootstrap-icons';
import { Button, Input } from '@nextui-org/react';

import { NamedColor } from '@/lib/model/color';

import ColorPicker from './ColorPicker';
import { addSnackbar } from './Snackbar';

export default function TagInput({
  className,
  classNames,
  addNewTag,
  linkTag
}: {
  className?: string;
  classNames?: { name: string };
  addNewTag: (name: string, color: NamedColor) => Promise<string>;
  linkTag?: (id: string) => unknown;
}) {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<NamedColor | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newTagColor) {
      addSnackbar('Please specify a tag color', 'error');

      return;
    }
    if (!newTagName) {
      addSnackbar('Please specify a tag name', 'error');

      return;
    }

    const id = await addNewTag(newTagName, newTagColor);

    if (linkTag) linkTag(id);
    setNewTagName('');
    setNewTagColor(null);
  }

  return (
    <form
      key='add'
      className={`flex w-full gap-2 ${className}`}
      onSubmit={handleSubmit}
    >
      <Input
        className={classNames?.name}
        placeholder='Add tag...'
        size='sm'
        value={newTagName}
        variant='underlined'
        onValueChange={setNewTagName}
      />
      <ColorPicker
        className='rounded-lg w-8 h-8 min-w-8 min-h-8'
        value={newTagColor}
        onValueChange={setNewTagColor}
      />
      <Button
        isIconOnly
        className='rounded-lg w-8 h-8 min-w-8 min-h-8'
        color='primary'
        type='submit'
        variant='flat'
      >
        <Check />
      </Button>
    </form>
  );
}
