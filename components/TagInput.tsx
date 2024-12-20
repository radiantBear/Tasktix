import { FormEvent, useState } from 'react';
import { Check } from 'react-bootstrap-icons';
import { Button, Input } from '@nextui-org/react';
import ColorPicker from './ColorPicker';
import { addSnackbar } from './Snackbar';
import { NamedColor } from '@/lib/model/color';

export default function TagInput({ className, classNames, addNewTag, linkTag }: { className?: string, classNames?: {name: string}, addNewTag: (name: string, color: NamedColor) => any, linkTag?: (id: string) => any }) {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<NamedColor|null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!newTagColor) {
      addSnackbar('Please specify a tag color', 'error');
      return;
    }
    if(!newTagName) {
      addSnackbar('Please specify a tag name', 'error');
      return;
    }

    const id = await addNewTag(newTagName, newTagColor);
    if(linkTag) linkTag(id);
    setNewTagName('');
    setNewTagColor(null);
  }

  return (
    <form onSubmit={handleSubmit} key='add' className={`flex w-full gap-2 ${className}`}>
      <Input variant='underlined' placeholder='Add tag...' className={classNames?.name} size='sm' value={newTagName} onValueChange={setNewTagName} />
      <ColorPicker value={newTagColor} onValueChange={setNewTagColor} className='rounded-lg w-8 h-8 min-w-8 min-h-8' />
      <Button type='submit' variant='flat' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><Check /></Button>
    </form>
  );
}