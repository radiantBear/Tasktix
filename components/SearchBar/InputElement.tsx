import { Filters, InputAction, InputOption } from './types';
import DateInput from '@/components/DateInput';
import TimeInput from '@/components/TimeInput';
import { getTextColor } from '@/lib/color';
import {
  Input,
  Select,
  SelectItem,
  Selection,
  Switch
} from '@nextui-org/react';
import { ReactElement } from 'react';

export default function InputElement({
  inputOption,
  value,
  dispatchFilters,
  onValueChange
}: {
  inputOption: InputOption;
  value: Filters;
  dispatchFilters: (action: InputAction) => any;
  onValueChange: (value: Filters) => any;
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
          value={value[inputOption.label]}
          onValueChange={handleInput}
          label={`${inputOption.label}:`}
          autoFocus
          labelPlacement='outside-left'
          size='sm'
          className='flex items-center w-52 h-fit mt-1 shrink-0'
        />
      );

    case 'Select':
      return (
        <Select
          selectedKeys={value[inputOption.label]}
          onSelectionChange={handleInput}
          label={`${inputOption.label}:`}
          autoFocus
          selectionMode='multiple'
          labelPlacement='outside-left'
          size='sm'
          className='flex items-center w-52 shrink-0'
        >
          {inputOption?.selectOptions?.map(option => (
            <SelectItem
              key={option.name}
              value={option.name}
              className={option.color ? '!' + getTextColor(option.color) : ''}
            >
              {option.name}
            </SelectItem>
          )) || <></>}
        </Select>
      );

    case 'Date':
      return (
        <DateInput
          value={value[inputOption.label]}
          onValueChange={handleInput}
          label={`${inputOption.label}:`}
          autoFocus
          className='!mb-1 h-unit-8 rounded-small'
        />
      );

    case 'Time':
      return (
        <TimeInput
          value={value[inputOption.label]}
          onValueChange={handleInput}
          label={`${inputOption.label}:`}
          size='sm'
          labelPlacement='outside-left'
          className='shrink-0'
          classNames={{ input: 'w-12' }}
        />
      );

    case 'Toggle':
      return (
        <Switch
          value={value[inputOption.label]}
          onValueChange={handleInput}
          autoFocus
          classNames={{
            base: 'flex-row-reverse gap-2 -mr-2',
            label: 'text-tiny'
          }}
        >{`${inputOption.label}:`}</Switch>
      );
  }
}
