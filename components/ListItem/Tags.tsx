'use client';

import { api } from '@/lib/api';
import { getBackgroundColor, getTextColor } from '@/lib/color';
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
          <Card tabIndex={isComplete ? 1 : 0} className={`px-4 basis-1/6 grow shrink flex flex-row items-center justify-start overflow-hidden flex-nowrap h-10 shadow-none cursor-pointer ${isComplete ? 'opacity-50' : 'hover:bg-foreground/10 focus:z-10 focus:outline-2 focus:outline-focus focus:outline-offset-2'}`}>
            <TagsIcon className='shrink-0' />
            <span className='ml-2 flex flex-row items-center justify-start overflow-hidden flex-nowrap'>
              {tags.map(tag => <Chip key={tag.id} variant='dot' size='sm' classNames={{dot: getBackgroundColor(tag.color), base: 'border-0', content: getTextColor(tag.color)}}>{tag.name}</Chip>)}
            </span>
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