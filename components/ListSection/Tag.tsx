import TagModel from '@/lib/model/tag';
import { Chip } from '@nextui-org/react';

export default function Tag({ tag, isComplete }: { tag: TagModel, isComplete: boolean }) {
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