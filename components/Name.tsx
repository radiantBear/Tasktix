import { Button, Input } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Check } from 'react-bootstrap-icons';

export default function Name({
  name,
  showLabel,
  showUnderline,
  disabled,
  className,
  classNames,
  updateName
}: {
  name: string;
  showLabel?: boolean;
  showUnderline?: boolean;
  disabled?: boolean;
  className?: string;
  classNames?: { input?: string; button?: string };
  updateName: (name: string) => any;
}) {
  const [newName, setNewName] = useState(name);
  const [prevName, setPrevName] = useState(name);

  useEffect(() => setPrevName(name), [name]);

  return (
    <form
      className='flex grow shrink w-full'
      onSubmit={e => {
        e.preventDefault();
        updateName(newName);
      }}
    >
      <Input
        className={`${disabled && 'opacity-50'} ${className}`}
        classNames={{
          inputWrapper: `${showLabel || showUnderline || 'border-transparent'}`,
          input: `${showLabel || showUnderline || '-mb-2'} ${classNames?.input}`
        }}
        disabled={disabled}
        label={showLabel && 'Name'}
        size='sm'
        value={newName}
        variant='underlined'
        onValueChange={setNewName}
      />
      <Button
        isIconOnly
        className={`rounded-lg w-8 h-8 min-w-8 min-h-8 ${newName == prevName ? 'hidden' : ''} ${showLabel ? 'mt-4' : ''} ${classNames?.button}`}
        color='primary'
        type='submit'
      >
        <Check />
      </Button>
    </form>
  );
}
