import SearchInput from './SearchInput';
import { InputOptionGroup } from './types';
import { Filter, FilterSquareFill } from "react-bootstrap-icons";
import { Key, useState } from 'react';

export default function SearchBar({ inputOptions }: { inputOptions: InputOptionGroup[] }) {
  const [usedOptions, setUsedOptions] = useState<Set<string>>(new Set());

  function addUsedOption(option: Key) {
    const newOptions = structuredClone(usedOptions);
    newOptions.add(option.toString());
    setUsedOptions(newOptions);
  }

  function clearUsedOptions() {
    setUsedOptions(new Set());
  }

  return (
    <span className='grow rounded-md w-100 overflow-hidden p-4 h-16 flex items-center justify-center gap-4 border-1 border-content3 bg-content1 shadow-lg shadow-content2'>
        {
          usedOptions.size
            ? <button aria-label='Clear filter' onClick={clearUsedOptions}><FilterSquareFill size={20} className='-mr-1' /></button>
            : <Filter size={20} className='-mr-1' />
        }
        
        <SearchInput inputOptions={inputOptions} usedOptions={usedOptions} addUsedOption={addUsedOption} />
    </span>
  );
}