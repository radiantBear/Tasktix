import {
  Input,
  Select,
  SelectItem,
  Selection,
  Switch
} from '@nextui-org/react';
import { ReactElement } from 'react';

import DateInput from '@/components/DateInput';
import TimeInput from '@/components/TimeInput';
import { getTextColor } from '@/lib/color';

import { Filters, InputAction, InputOption } from './types';

export default function InputElement({
  inputOption,
  value,
  dispatchFilters,
  onValueChange
}: {
  inputOption: InputOption;
  value: Filters;
  dispatchFilters: (action: InputAction) => unknown;
  onValueChange: (value: Filters) => unknown;
}): ReactElement {
  function handleInput(newValue: number | string | boolean | Selection | Date) {
    if (newValue instanceof Date) newValue.setHours(23, 59, 59, 0);

    dispatchFilters({
      type: 'Update',
      label: inputOption.label,
      value: newValue,
      callback: onValueChange
    });
  }

  switch (inputOption.type) {
    case 'String':
      return (
        <Input
          autoFocus
          className='flex items-center w-52 h-fit mt-1 shrink-0'
          label={`${inputOption.label}:`}
          labelPlacement='outside-left'
          size='sm'
          value={value[inputOption.label]}
          onValueChange={handleInput}
        />
      );

    case 'Select':
      return (
        <Select
          autoFocus
          className='flex items-center w-52 shrink-0'
          label={`${inputOption.label}:`}
          labelPlacement='outside-left'
          selectedKeys={value[inputOption.label]}
          selectionMode='multiple'
          size='sm'
          onSelectionChange={handleInput}
        >
          {inputOption?.selectOptions?.map(option => (
            <SelectItem
              key={option.name}
              className={option.color ? '!' + getTextColor(option.color) : ''}
              value={option.name}
            >
              {option.name}
            </SelectItem>
          )) || <></>}
        </Select>
      );

    case 'Date':
      return (
        <DateInput
          autoFocus
          className='!mb-1 h-unit-8 rounded-small'
          label={`${inputOption.label}:`}
          value={value[inputOption.label]}
          onValueChange={handleInput}
        />
      );

    case 'Time':
      return (
        <TimeInput
          className='shrink-0'
          classNames={{ input: 'w-12' }}
          label={`${inputOption.label}:`}
          labelPlacement='outside-left'
          size='sm'
          value={value[inputOption.label]}
          onValueChange={handleInput}
        />
      );

    case 'Toggle':
      return (
        <Switch
          autoFocus
          classNames={{
            base: 'flex-row-reverse gap-2 -mr-2',
            label: 'text-tiny'
          }}
          value={value[inputOption.label]}
          onValueChange={handleInput}
        >{`${inputOption.label}:`}</Switch>
      );
  }
}
