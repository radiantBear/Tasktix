import { useState } from 'react';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';

import Time from './Time';

export default function ElapsedInput({
  disabled,
  ms,
  resetTime
}: {
  disabled: boolean;
  ms: number;
  resetTime: () => unknown;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      placement='bottom'
      onOpenChange={open => {
        if (!disabled) setIsOpen(open);
      }}
    >
      <PopoverTrigger className='-mx-2 -px-2'>
        <Button
          isIconOnly
          className={`w-fit !px-2 bg-transparent p-0 ${disabled ? '' : 'hover:bg-foreground/10'}`}
          disabled={disabled}
          tabIndex={0}
        >
          <Time label='Elapsed' ms={ms} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-2'>
        <Button
          color='warning'
          variant='light'
          onPress={() => {
            resetTime();
            setIsOpen(false);
          }}
        >
          <ArrowCounterclockwise />
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
}
