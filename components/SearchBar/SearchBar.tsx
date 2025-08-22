import { Filter as FilterIcon, FilterSquareFill } from 'react-bootstrap-icons';
import { Key, ReactElement, useReducer, useState } from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection
} from '@nextui-org/react';

import { Filters, InputOptionGroup } from './types';
import searchReducer from './searchReducer';
import InputElement from './InputElement';
import { getIcon } from './getIcon';

export default function SearchBar({
  inputOptions,
  onValueChange
}: {
  inputOptions: InputOptionGroup[];
  onValueChange: (value: Filters) => unknown;
}) {
  const [usedOptions, setUsedOptions] = useState<Set<string>>(new Set());
  const [value, setValue] = useState('');
  const [filters, dispatchFilters] = useReducer(searchReducer, {});

  const _options = inputOptions.flatMap(optionGrp => optionGrp.options);
  const remainingOptions = inputOptions.map(o => {
    return {
      label: o.label,
      options: o.options.filter(option => !usedOptions.has(option.label))
    };
  });

  const inputFields: ReactElement[] = [];

  for (const key in filters) {
    const option = _options.find(option => option.label == key);

    if (!option) return;

    inputFields.push(
      <InputElement
        dispatchFilters={dispatchFilters}
        inputOption={option}
        value={filters}
        onValueChange={onValueChange}
      />
    );
  }

  function addUsedOption(option: Key) {
    const newOptions = structuredClone(usedOptions);

    newOptions.add(option.toString());
    setUsedOptions(newOptions);
    dispatchFilters({
      type: 'Add',
      label: option.toString(),
      value: undefined,
      callback: onValueChange
    });
  }

  function clearUsedOptions() {
    setUsedOptions(new Set());
    dispatchFilters({
      type: 'Clear',
      callback: onValueChange
    });
  }

  function handleInput(input: string) {
    if (input.at(-1) != ':') {
      setValue(input);

      return;
    }

    const optionName = input.slice(0, -1);

    if (
      inputOptions.find(option =>
        option.options.find(option => option.label == optionName)
      )
    )
      addUsedOption(optionName);

    setValue('');
  }

  function handleSelectionChange(selection: Key | null) {
    if (selection != null) addUsedOption(selection.toString());

    setValue('');
  }

  return (
    <span className='grow rounded-md w-100 overflow-hidden p-4 h-16 flex items-center justify-center gap-4 border-2 border-content3 bg-content1 shadow-lg shadow-content2'>
      {usedOptions.size ? (
        <button aria-label='Clear filter' onClick={clearUsedOptions}>
          <FilterSquareFill className='-mr-1' size={20} />
        </button>
      ) : (
        <FilterIcon className='-mr-1' size={20} />
      )}

      <Autocomplete
        className='grow'
        classNames={{ selectorButton: 'hidden' }}
        inputValue={value}
        placeholder={usedOptions.size ? '' : 'Filter...'}
        selectedKey={null}
        startContent={<span className='flex gap-3'>{inputFields}</span>}
        variant='underlined'
        onSelectionChange={handleSelectionChange}
        onValueChange={handleInput}
      >
        {remainingOptions.map(option => (
          <AutocompleteSection
            key={option.label}
            showDivider
            title={option.label}
          >
            {option.options.map(option => (
              <AutocompleteItem
                key={option.label}
                startContent={getIcon(option.type)}
              >
                {`${option.label}:`}
              </AutocompleteItem>
            ))}
          </AutocompleteSection>
        ))}
      </Autocomplete>
    </span>
  );
}
