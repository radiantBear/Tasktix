import Insert from './Insert';
import { InputOption, InputOptionGroup } from './types';
import { getIcon } from './getIcon';
import DateInput from '@/components/DateInput';
import TimeInput from '@/components/TimeInput';
import { getTextColor } from '@/lib/color';
import { AutocompleteItem, Autocomplete, Input, Select, SelectItem, Switch, AutocompleteSection } from '@nextui-org/react';
import { Key, ReactElement, useState } from 'react';

export default function SearchInput({ inputOptions, usedOptions, addUsedOption }: { inputOptions: InputOptionGroup[], usedOptions: Set<string>, addUsedOption: (option: Key) => any }) {
  const [value, setValue] = useState('');
  
  const _options = inputOptions.flatMap(optionGrp => optionGrp.options);
  const remainingOptions = inputOptions.map(o => { return { label: o.label, options: o.options.filter(option => !usedOptions.has(option.label)) }});

  const inputFields: ReactElement[] = [];
  usedOptions.forEach(optionName => inputFields.push(getInputElement(_options.find(option => option.label == optionName))));

  function handleInput(input: string) {
    if(input.at(-1) != ':') {
      setValue(input);
      return;
    }

    const optionName = input.slice(0, -1);
    if(inputOptions.find(option => option.options.find(option => option.label == optionName))) {
      addUsedOption(optionName);
    }
    
    setValue('');
  }

  function handleSelectionChange(selection: Key) {
    if(selection != null)
      addUsedOption(selection.toString());
    
    setValue('');
  }

  return (
    <Autocomplete
      startContent={<span className='flex gap-3'>{inputFields}</span>}
      endContent={<Insert onSelect={addUsedOption} inputOptions={remainingOptions} />}
      variant='underlined'
      placeholder={usedOptions.size ? '' : 'Filter...'}
      className='grow'
      classNames={{selectorButton: 'hidden'}}
      inputValue={value}
      onValueChange={handleInput}
      selectedKey={null}
      onSelectionChange={handleSelectionChange}
    >
      {
        remainingOptions.map(option => 
          <AutocompleteSection showDivider title={option.label} key={option.label}>
            {
              option.options.map(option => 
                <AutocompleteItem key={option.label} startContent={getIcon(option.type)}>
                  {`${option.label}:`}
                </AutocompleteItem>
              )
            }
          </AutocompleteSection>
        )
      }
    </Autocomplete>
  );
}

function getInputElement(inputOption?: InputOption): ReactElement {
  if( inputOption == undefined) 
    return <></>;
  
  switch(inputOption.type) {
    case 'String':
      return (
        <Input label={`${inputOption.label}:`} labelPlacement='outside-left' size='sm' className='flex items-center w-52 h-fit mt-1 shrink-0' />
      );
    
    case 'Select':
      return (
        <Select label={`${inputOption.label}:`} selectionMode='multiple' labelPlacement='outside-left' size='sm' className='flex items-center w-52 shrink-0'>
          { inputOption?.selectOptions?.map(option => <SelectItem key={option.name} value={option.name} className={option.color ? '!'+getTextColor(option.color) : ''}>{option.name}</SelectItem>) || <></> }
        </Select>
      );

    case 'Date':
      return <DateInput label={`${inputOption.label}:`} className='!mb-1 h-unit-8 rounded-small' />;
    
    case 'Time':
      return <TimeInput label={`${inputOption.label}:`} size='sm' labelPlacement='outside-left' className='shrink-0' classNames={{input: 'w-12'}} />;
    
    case 'Toggle':
      return (
        <Switch classNames={{base: 'flex-row-reverse gap-2 -mr-2', label: 'text-tiny'}}>{`${inputOption.label}:`}</Switch>
      );
  }
}