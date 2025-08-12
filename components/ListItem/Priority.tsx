import {
  Select,
  SelectItem,
  Selection,
  SlotsToClasses
} from '@nextui-org/react';

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
        className={`w-28 grow-0 shrink-0 ${className || ''}`}
        classNames={classNames}
        color={`${priority == 'High' ? 'danger' : priority == 'Medium' ? 'warning' : 'success'}`}
        isDisabled={isComplete}
        label={<span className='ml-2 text-foreground'>Priority</span>}
        labelPlacement='outside'
        placeholder='Select...'
        selectedKeys={_priority}
        size='sm'
        variant='flat'
        onSelectionChange={(keys: Selection) =>
          setPriority((keys != 'all' && keys.keys().next().value) || 'Low')
        }
      >
        <SelectItem key='High' color='danger' value='High'>
          High
        </SelectItem>
        <SelectItem key='Medium' color='warning' value='Medium'>
          Medium
        </SelectItem>
        <SelectItem key='Low' color='success' value='Low'>
          Low
        </SelectItem>
      </Select>
    </div>
  );
}
