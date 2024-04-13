'use client';

import { Input, Popover, PopoverContent, PopoverTrigger, SlotsToClasses } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';
import CalendarInput from './CalendarInput';
import { formatDate } from '@/lib/date';

export default function DateInput2({ label, placeholder, className, classNames, defaultValue, color = 'default', size, variant, tabIndex, value, onValueChange }: { label?: string, placeholder?: string, className: string, classNames: SlotsToClasses<'label'|'input'|'base'|'description'|'errorMessage'|'mainWrapper'|'inputWrapper'|'innerWrapper'|'clearButton'|'helperWrapper'>, defaultValue?: Date, color?: 'default'|'primary'|'secondary'|'danger'|'warning'|'success', size?: 'sm'|'md'|'lg', tabIndex?: number, variant?: 'flat'|'faded'|'bordered'|'underlined', value?: Date, onValueChange?: (date: Date) => any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(value || defaultValue || null);
  const input = useRef<HTMLInputElement|null>();
  const lastTrigger = useRef(new Date());

  // Respect the `value` prop if there is one
  useEffect(() => {
    if (value !== undefined)
      setDate(value);
  }, [value]);

  function handleInput(value: Date) {
    if(value)
      onValueChange && onValueChange(value);
    else
      setDate(value);
    debounceOpenChange(false);
  }
  
  function debounceOpenChange(isOpen: boolean) {
    if(Date.now() - lastTrigger.current.getTime() < 250) {
      if(input.current) {
        input.current.blur();
        input.current.dataset.focusWithin = 'false';
        input.current.dataset.focus = 'false';
      }
      return;
    }
    lastTrigger.current = new Date();
    
    if(isOpen) {
      setIsOpen(true)
      if(input.current) {
        input.current.blur();
        input.current.dataset.focusWithin = 'true';
        input.current.dataset.focus = 'true';
      }
    }
    else {
      setIsOpen(false);
      if(input.current) {
        input.current.blur();
        input.current.dataset.focusWithin = 'false';
        input.current.dataset.focus = 'false';
      }
    }

    input.current?.blur();
  }

  return (
    <Input
      label={label}
      value={date ? formatDate(date, false) : undefined}
      placeholder={placeholder}
      defaultValue={defaultValue ? formatDate(defaultValue) : undefined}
      variant={variant}
      onFocusChange={debounceOpenChange}
      className={className}
      classNames={classNames}
      autoFocus
      startContent={
        <Popover placement='bottom-start' isOpen={isOpen} onOpenChange={debounceOpenChange}>
          <PopoverTrigger className='-ml-2 -mb-2 mt-1'>
            <div className='invisible'></div>
          </PopoverTrigger>
          <PopoverContent className='p-0 overflow-hidden'>
            <CalendarInput defaultValue={defaultValue} color={color} value={value} onValueChange={handleInput} />
          </PopoverContent>
        </Popover>
      }
    />
  );
}