import { InputOptionGroup } from './types';
import { getIcon } from './getIcon';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { ChevronLeft, PlusLg } from 'react-bootstrap-icons';
import { Key, useRef, useState } from 'react';

export default function Insert({ inputOptions, onSelect }: { inputOptions: InputOptionGroup[], onSelect: (option: Key) => any }) {
  const [isOpen, setIsOpen] = useState<{[key: string]: boolean}>({});

  function handleMouseIn(option: string) {
    const newIsOpen = structuredClone(isOpen);
    newIsOpen[option] = true;
    setIsOpen(newIsOpen);
  }
  function handleMouseOut(option: string) {
    const newIsOpen = structuredClone(isOpen);
    newIsOpen[option] = false;
    setIsOpen(newIsOpen);
  }

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Button variant='light' isIconOnly><PlusLg /></Button>
      </DropdownTrigger>
      <DropdownMenu onAction={() => null} items={inputOptions}>
        { optionGroup => 
            <DropdownItem key={optionGroup.label} startContent={<ChevronLeft />}>
              <Dropdown isOpen={isOpen[optionGroup.label]} placement='left'>
                <DropdownTrigger onMouseOver={handleMouseIn.bind(null, optionGroup.label)} onMouseLeave={handleMouseOut.bind(null, optionGroup.label)}>
                  { optionGroup.label }
                </DropdownTrigger>
                <DropdownMenu onAction={onSelect} onMouseOver={handleMouseIn.bind(null, optionGroup.label)} onMouseLeave={handleMouseOut.bind(null, optionGroup.label)}>
                  { 
                    optionGroup.options.map(option => 
                      <DropdownItem key={option.label} startContent={getIcon(option.type)}>
                        {option.label}
                      </DropdownItem>
                    )
                  }
                </DropdownMenu>
              </Dropdown>
            </DropdownItem>
        }
      </DropdownMenu>
    </Dropdown>
  );
}
