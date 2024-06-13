import { FormEvent, useEffect, useState } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Check } from 'react-bootstrap-icons';
import Time from './Time';
import TimeInput from '../TimeInput';

export default function ExpectedInput({ ms, disabled, updateMs }: { ms: number|null, disabled: boolean, updateMs: (ms: number) => any }) {
  const [value, setValue] = useState(ms ?? 0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setValue(ms ?? 0), [ms]);

  function _updateTime(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateMs(value);
    setIsOpen(false);
  }

  return (
    <Popover placement='bottom' isOpen={isOpen} onOpenChange={open => {if(!disabled) setIsOpen(open)}}>
      <PopoverTrigger className='-mr-2 -my-3 -px-2 relative top-3'>
        <Button tabIndex={0} disabled={disabled} isIconOnly className={`w-fit !px-2 bg-transparent p-0 ${disabled ? '' : 'hover:bg-foreground/10'}`}>
          <Time label='Expected' ms={ms || 0} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-3'>
        <form onSubmit={_updateTime} className='flex flex-row items-center gap-2'>
          <TimeInput value={value || undefined} onValueChange={setValue} size='sm' variant='underlined' color='primary' className='w-12 grow-0' />
          <Button type='submit' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'>
            <Check />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}