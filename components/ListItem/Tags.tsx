'use client';

import { api } from '@/lib/api';
import { getTextColor } from '@/lib/color';
import TagModel from '@/lib/model/tag';
import { Button, Chip, Card, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useState } from 'react';
import { X, Check, Plus, Tags as TagsIcon } from 'react-bootstrap-icons';
import { addSnackbar } from '../Snackbar';
import Color from '@/lib/model/color';
import ColorPicker from '../ColorPicker';

export default function Tags({ itemId, initialTags, isComplete, tagsAvailable, addNewTag }: { itemId: string, initialTags: TagModel[], isComplete: boolean, tagsAvailable: TagModel[], addNewTag: (name: string, color: Color) => any }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [tags, setTags] = useState<TagModel[]>(initialTags);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<Color|null>(null);

  function linkTag(id: string, name?: string, color?: Color) {
    api.post(`/item/${itemId}/tag/${id}`, {})
      .then(res => {
        addSnackbar(res.message, 'success');

        // Add the tag
        const newTags = structuredClone(tags);

        if(!name || !color){
          const tag = tagsAvailable.find(tag => tag.id == id);
          if(!tag)
            throw Error('Could not find tag with id '+id);

          newTags.push(new TagModel(tag.name, tag.color, id));
        }
        else
          newTags.push(new TagModel(name, color, id));
        
        setTags(newTags);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function unlinkTag(id: string) {
    api.delete(`/item/${itemId}/tag/${id}`)
      .then(res => {
        addSnackbar(res.message, 'success');

        const newTags = structuredClone(tags);
        for(let i = 0; i < newTags.length; i++)
          if(newTags[i].id == id)
            newTags.splice(i, 1);
        setTags(newTags);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  async function linkNewTag() {
    if(!newTagColor) {
      addSnackbar('Please specify a tag color', 'error');
      return;
    }
    if(!newTagName) {
      addSnackbar('Please specify a tag name', 'error');
      return;
    }

    const id = await addNewTag(newTagName, newTagColor);
    linkTag(id, newTagName, newTagColor);
    setNewTagName('');
    setNewTagColor(null);
  }

  return (
      <Popover placement='bottom' isOpen={isPopoverOpen} onOpenChange={open => {if(!isComplete) setIsPopoverOpen(open)}}>
        <PopoverTrigger>
          <Card tabIndex={isComplete ? 1 : 0} className={`px-4 w-1/4 flex flex-row items-center justify-start overflow-hidden flex-nowrap h-10 shadow-none cursor-pointer ${isComplete ? 'opacity-50' : 'hover:bg-foreground/10 focus:z-10 focus:outline-2 focus:outline-focus focus:outline-offset-2'}`}>
            <TagsIcon className='mr-2 shrink-0' />
            {tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </Card>
        </PopoverTrigger>
        <PopoverContent>
          {
            tags.map(tag => (
              <div key={tag.id} className={`${getTextColor(tag.color)} flex justify-between items-center w-full p-1.5`}>
                {tag.name}
                <Button onPress={unlinkTag.bind(null, tag.id)} variant='flat' color='danger' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><X /></Button>
              </div>
            ))
          }
          {
            tagsAvailable.map(tag => {
              if(!tags.some(usedTag => usedTag.id == tag.id))
                return (
                  <div key={tag.id} className={`${getTextColor(tag.color)} flex justify-between items-center w-full p-1.5`}>
                    {tag.name}
                    <Button onPress={linkTag.bind(null, tag.id, undefined, undefined)} variant='flat' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><Plus /></Button>
                  </div>
                );
            })
          }
          <div key='add' className='flex w-full p-1.5 pl-1 gap-2'>
            <Input variant='underlined' placeholder='Add tag...' className='w-24' size='sm' value={newTagName} onValueChange={setNewTagName} />
            <ColorPicker value={newTagColor} onValueChange={setNewTagColor} className='rounded-lg w-8 h-8 min-w-8 min-h-8' />
            <Button onPress={linkNewTag} variant='flat' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><Check /></Button>
          </div>
        </PopoverContent>
      </Popover>
  );
}

function Tag({ tag }: { tag: TagModel }) {
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

  return <Chip variant='dot' size='sm' classNames={{dot: bgColor, base: 'border-0', content: textColor}}>{tag.name}</Chip>;
}