'use client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react';
import { useState } from 'react';
import { PaletteFill, X } from 'react-bootstrap-icons';

import { namedColors, NamedColor } from '@/lib/model/color';
import { getBackgroundColor } from '@/lib/color';

export default function ColorPicker({
  value,
  onValueChange,
  className
}: {
  value: NamedColor | null;
  onValueChange: (color: NamedColor | null) => any;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function pickColor(color: NamedColor | null) {
    onValueChange(color);
    setIsOpen(false);
  }

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          isIconOnly
          className={`${value ? getBackgroundColor(value) : ''} ${className}`}
          size='sm'
        >
          <PaletteFill />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='grid grid-cols-3 gap-1'>
        {namedColors.map(color => (
          <Button
            key={color}
            isIconOnly
            aria-label={color}
            className={`rounded-md w-6 h-6 min-w-6 min-h-6 ${getBackgroundColor(color)}`}
            onPress={pickColor.bind(null, color)}
          />
        ))}
        <Button
          key='clear'
          isIconOnly
          aria-label='clear'
          className={`rounded-md w-6 h-6 min-w-6 min-h-6`}
          onPress={pickColor.bind(null, null)}
        >
          <X />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
