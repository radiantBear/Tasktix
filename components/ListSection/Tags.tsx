'use client';

import { api } from '@/lib/api';
import { getTextColor } from '@/lib/color';
import TagModel from '@/lib/model/tag';
import { Button, Chip, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useState } from 'react';
import { X, Check, Tags as TagsIcon } from 'react-bootstrap-icons';
import { addSnackbar } from '../Snackbar';

export default function Tags({ listId, itemId, initialTags, isComplete }: { listId: string, itemId: string, initialTags: string, isComplete: boolean }) {
  const [tags, setTags] = useState<TagModel[]>(JSON.parse(initialTags));
  const [newTagValue, setNewTagValue] = useState('');

  function linkTag(tagId: string) {
    api.post(`/item/${itemId}/tag/${tagId}`, {})
      .then(res => {
        addSnackbar(res.message, 'success');

        const newTags = structuredClone(tags);
        newTags.push(new TagModel(newTagValue, 'Red', res.content));
        setTags(newTags);

        setNewTagValue('');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  function addNewTag() {
    api.post(`/list/${listId}/tag`, { name: newTagValue, color: 'Red' })
      .then(res => {
        const id = res.content?.split('/').at(-1) || '';
        linkTag(id);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <div className='w-1/4 flex items-center justify-start overflow-hidden flex-nowrap h-10'>
      <Popover>
        <PopoverTrigger>
          <Button variant='flat' isIconOnly className='bg-transparent hover:bg-foreground/10'><TagsIcon /></Button>
        </PopoverTrigger>
        <PopoverContent>
          {tags.map(tag => (
            <div key={tag.id} className={`${getTextColor(tag.color)} flex justify-between items-center w-full p-1.5`}>
              {tag.name}
              <Button variant='flat' color='danger' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><X /></Button>
            </div>
          ))}
          <div key='add' className='flex w-full p-1.5 pl-1 gap-2'>
            <Input variant='underlined' placeholder='Add tag...' className='w-24' size='sm' value={newTagValue} onValueChange={setNewTagValue} />
            <Button onPress={addNewTag} variant='flat' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><Check /></Button>
          </div>
        </PopoverContent>
      </Popover>
      {tags.map(tag => <Tag key={tag.id} tag={tag} isComplete={isComplete} />)}
    </div>
  );
}

function Tag({ tag, isComplete }: { tag: TagModel, isComplete: boolean }) {
  let textColor: string;
  switch(tag.color) {
    case 'Pink':
      textColor = 'text-pink-500';
      break;
    case 'Red':
      textColor = 'text-red-500';
      break;
    case 'Orange':
      textColor = 'text-orange-500';
      break;
    case 'Amber':
      textColor = 'text-amber-500';
      break;
    case 'Yellow':
      textColor = 'text-yellow-500';
      break;
    case 'Lime':
      textColor = 'text-lime-500';
      break;
    case 'Green':
      textColor = 'text-green-500';
      break;
    case 'Emerald':
      textColor = 'text-emerald-500';
      break;
    case 'Cyan':
      textColor = 'text-cyan-500';
      break;
    case 'Blue':
      textColor = 'text-blue-500';
      break;
    case 'Violet':
      textColor = 'text-violet-500';
      break;
  }

  let bgColor: string;
  switch(tag.color) {
    case 'Pink':
      bgColor = 'bg-pink-500';
      break;
    case 'Red':
      bgColor = 'bg-red-500';
      break;
    case 'Orange':
      bgColor = 'bg-orange-500';
      break;
    case 'Amber':
      bgColor = 'bg-amber-500';
      break;
    case 'Yellow':
      bgColor = 'bg-yellow-500';
      break;
    case 'Lime':
      bgColor = 'bg-lime-500';
      break;
    case 'Green':
      bgColor = 'bg-green-500';
      break;
    case 'Emerald':
      bgColor = 'bg-emerald-500';
      break;
    case 'Cyan':
      bgColor = 'bg-cyan-500';
      break;
    case 'Blue':
      bgColor = 'bg-blue-500';
      break;
    case 'Violet':
      bgColor = 'bg-violet-500';
      break;
  }

  return <Chip variant='dot' size='sm' className={`${isComplete ? 'opacity-50' : ''}`} classNames={{dot: bgColor, base: 'border-0', content: textColor}}>{tag.name}</Chip>;
}