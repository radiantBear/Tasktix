'use client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react';
import { ReactNode, useEffect, useState } from 'react';

import { formatDate } from '@/lib/date';

import CalendarInput from './CalendarInput';

export default function DateInput({
  autoFocus,
  label,
  placeholder,
  defaultValue,
  displayContent,
  color = 'default',
  className,
  value,
  onValueChange
}: {
  autoFocus?: boolean;
  label?: string;
  placeholder?: string;
  defaultValue?: Date;
  displayContent?: ReactNode;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'success';
  className?: string;
  value?: Date;
  onValueChange?: (date: Date) => unknown;
}) {
  const [isOpen, setIsOpen] = useState(autoFocus);
  const [date, setDate] = useState(value || defaultValue || null);

  // Respect the `value` prop if there is one
  useEffect(() => {
    if (value !== undefined) setDate(value);
  }, [value]);

  function handleInput(value: Date) {
    if (onValueChange) onValueChange(value);
    else setDate(value);
    setIsOpen(false);
  }

  return (
    <Popover isOpen={isOpen} placement='bottom' onOpenChange={setIsOpen}>
      <PopoverTrigger className='-ml-2 -mb-2 mt-1'>
        <Button
          className={`w-fit min-w-0 px-2 py-1 text-xs justify-start ${className}`}
          color={color}
          variant='light'
        >
          {displayContent
            ? `${label || ''} ${displayContent}`
            : `${label || ''} ${date ? formatDate(date) : placeholder || 'Choose date'}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0 overflow-hidden'>
        <CalendarInput
          color={color}
          defaultValue={defaultValue}
          value={value}
          onValueChange={handleInput}
        />
      </PopoverContent>
    </Popover>
  );
}
