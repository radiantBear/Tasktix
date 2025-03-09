import {
  Select,
  SelectItem,
  Selection,
  SlotsToClasses
} from '@nextui-org/react';
import { useState } from 'react';
import ListItem from '@/lib/model/listItem';

export default function Priority({
  isComplete,
  priority,
  className,
  wrapperClassName,
  classNames,
  setPriority
}: {
  isComplete: boolean;
  priority: ListItem['priority'];
  className?: string;
  wrapperClassName?: string;
  classNames?: SlotsToClasses<
    | 'description'
    | 'errorMessage'
    | 'label'
    | 'base'
    | 'value'
    | 'mainWrapper'
    | 'trigger'
    | 'innerWrapper'
    | 'selectorIcon'
    | 'spinner'
    | 'listboxWrapper'
    | 'listbox'
    | 'popoverContent'
    | 'helperWrapper'
  >;
  setPriority: (priority: ListItem['priority']) => any;
}) {
  const _priority = new Set([priority]);

  return (
    <div className={`-mt-2 -mb-2 ${wrapperClassName}`}>
      <Select
        isDisabled={isComplete}
        variant='flat'
        labelPlacement='outside'
        size='sm'
        className={`w-28 grow-0 shrink-0 ${className || ''}`}
        label={<span className='ml-2 text-foreground'>Priority</span>}
        placeholder='Select...'
        selectedKeys={_priority}
        onSelectionChange={(keys: Selection) =>
          setPriority((keys != 'all' && keys.keys().next().value) || 'Low')
        }
        color={`${priority == 'High' ? 'danger' : priority == 'Medium' ? 'warning' : 'success'}`}
        classNames={classNames}
      >
        <SelectItem key='High' value='High' color='danger'>
          High
        </SelectItem>
        <SelectItem key='Medium' value='Medium' color='warning'>
          Medium
        </SelectItem>
        <SelectItem key='Low' value='Low' color='success'>
          Low
        </SelectItem>
      </Select>
    </div>
  );
}
