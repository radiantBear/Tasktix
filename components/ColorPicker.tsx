'use client';

import { getBackgroundColor } from '@/lib/color';
import { namedColors, NamedColor } from '@/lib/model/color';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react';
import { useState } from 'react';
import { PaletteFill, X } from 'react-bootstrap-icons';

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
          size='sm'
          isIconOnly
          className={`${value ? getBackgroundColor(value) : ''} ${className}`}
        >
          <PaletteFill />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='grid grid-cols-3 gap-1'>
        {namedColors.map(color => (
          <Button
            onPress={pickColor.bind(null, color)}
            key={color}
            isIconOnly
            className={`rounded-md w-6 h-6 min-w-6 min-h-6 ${getBackgroundColor(color)}`}
            aria-label={color}
          />
        ))}
        <Button
          onPress={pickColor.bind(null, null)}
          key='clear'
          isIconOnly
          className={`rounded-md w-6 h-6 min-w-6 min-h-6`}
          aria-label='clear'
        >
          <X />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
