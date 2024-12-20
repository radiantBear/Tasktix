'use client';

import { getBackgroundColor, getTextColor } from '@/lib/color';
import TagModel from '@/lib/model/tag';
import { Button, Chip, Card, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useState } from 'react';
import { X, Plus, Tags as TagsIcon } from 'react-bootstrap-icons';
import { NamedColor } from '@/lib/model/color';
import TagInput from '../TagInput';

export default function Tags({ tags, isComplete, tagsAvailable, className, addNewTag, linkTag, unlinkTag }: { tags: TagModel[], isComplete: boolean, tagsAvailable?: TagModel[], className?: string, addNewTag: (name: string, color: NamedColor) => any, linkTag: (id: string) => any, unlinkTag: (id: string) => any }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
      <Popover placement='bottom' isOpen={isPopoverOpen} onOpenChange={open => {if(!isComplete) setIsPopoverOpen(open)}}>
        <PopoverTrigger>
          <Card tabIndex={isComplete ? 1 : 0} className={`px-4 basis-1/6 grow shrink flex flex-row items-center justify-start overflow-hidden flex-nowrap h-10 shadow-none cursor-pointer bg-transparent ${isComplete ? 'opacity-50 cursor-default' : 'hover:bg-foreground/10 focus:z-10 focus:outline-2 focus:outline-focus focus:outline-offset-2'} ${className}`}>
            <TagsIcon className='shrink-0' />
            <span className='ml-2 flex flex-row items-center justify-start overflow-hidden flex-nowrap'>
              {tags.sort((a, b) => a.name > b.name ? 1 : -1).map(tag => <Chip key={tag.id} variant='dot' size='sm' classNames={{dot: getBackgroundColor(tag.color), base: 'border-0', content: getTextColor(tag.color)}}>{tag.name}</Chip>)}
            </span>
          </Card>
        </PopoverTrigger>
        <PopoverContent>
          {
            tags.sort((a, b) => a.name > b.name ? 1 : -1).map(tag => (
              <div key={tag.id} className={`${getTextColor(tag.color)} flex justify-between items-center w-full p-1.5`}>
                {tag.name}
                <Button onPress={unlinkTag.bind(null, tag.id)} variant='flat' color='danger' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><X /></Button>
              </div>
            ))
          }
          {
            tagsAvailable
              ? tagsAvailable.sort((a, b) => a.name > b.name ? 1 : -1).map(tag => {
                if(!tags.some(usedTag => usedTag.id == tag.id))
                  return (
                    <div key={tag.id} className={`${getTextColor(tag.color)} flex justify-between items-center w-full p-1.5`}>
                      {tag.name}
                      <Button onPress={linkTag.bind(null, tag.id)} variant='flat' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'><Plus /></Button>
                    </div>
                  );
              })
              : <></>
          }
          <TagInput linkTag={linkTag} addNewTag={addNewTag} className='p-1.5 pl-1' classNames={{name: 'w-24'}} />
        </PopoverContent>
      </Popover>
  );
}