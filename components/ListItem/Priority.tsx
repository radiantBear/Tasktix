import { Select, SelectItem, Selection, SlotsToClasses } from "@nextui-org/react";
import { useState } from "react";
import ListItem from "@/lib/model/listItem";
import { api } from "@/lib/api";
import { addSnackbar } from "../Snackbar";

export default function Priority({ isComplete, startingPriority, itemId, className, wrapperClassName, classNames }: { isComplete: boolean, startingPriority: ListItem['priority'], itemId: string, className?: string, wrapperClassName?: string, classNames?: SlotsToClasses<"description"|"errorMessage"|"label"|"base"|"value"|"mainWrapper"|"trigger"|"innerWrapper"|"selectorIcon"|"spinner"|"listboxWrapper"|"listbox"|"popoverContent"|"helperWrapper"> }) {
  const [priority, setPriority] = useState<Selection>(new Set([startingPriority]));
  
  function updatePriority(keys: Selection) {
    const priority = (keys != 'all' && keys.keys().next().value) || 'Low';
    api.patch(`/item/${itemId}`, { priority })
      .then(res => {
        addSnackbar(res.message, 'success');
        setPriority(keys);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

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
        selectedKeys={priority}
        onSelectionChange={updatePriority}
        color={`${(priority == 'all' || priority.has('High')) ? 'danger' : priority.has('Medium') ? 'warning' : priority.has('Low') ? 'success' : 'default'}`}
        classNames={classNames}
      >
        <SelectItem key='High' value='High' color='danger'>High</SelectItem>
        <SelectItem key='Medium' value='Medium' color='warning'>Medium</SelectItem>
        <SelectItem key='Low' value='Low' color='success'>Low</SelectItem>
      </Select>
    </div>
  );
}