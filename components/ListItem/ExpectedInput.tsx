import { FormEvent, useEffect, useState } from 'react';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react';
import { Check } from 'react-bootstrap-icons';

import TimeInput from '../TimeInput';

import Time from './Time';

export default function ExpectedInput({
  ms,
  disabled,
  updateMs
}: {
  ms: number | null;
  disabled: boolean;
  updateMs: (ms: number) => any;
}) {
  const [value, setValue] = useState(ms ?? 0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setValue(ms ?? 0), [ms]);

  function _updateTime(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateMs(value);
    setIsOpen(false);
  }

  return (
    <Popover
      isOpen={isOpen}
      placement='bottom'
      onOpenChange={open => {
        if (!disabled) setIsOpen(open);
      }}
    >
      <PopoverTrigger className='-mr-2 -my-3 -px-2 relative top-3'>
        <Button
          isIconOnly
          className={`w-fit !px-2 bg-transparent p-0 ${disabled ? '' : 'hover:bg-foreground/10'}`}
          disabled={disabled}
          tabIndex={0}
        >
          <Time label='Expected' ms={ms || 0} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-3'>
        <form
          className='flex flex-row items-center gap-2'
          onSubmit={_updateTime}
        >
          <TimeInput
            className='w-12 grow-0'
            color='primary'
            size='sm'
            value={value || undefined}
            variant='underlined'
            onValueChange={setValue}
          />
          <Button
            isIconOnly
            className='rounded-lg w-8 h-8 min-w-8 min-h-8'
            color='primary'
            type='submit'
          >
            <Check />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
