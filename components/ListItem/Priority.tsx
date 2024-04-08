import { Select, SelectItem, Selection } from "@nextui-org/react";
import { useState } from "react";
import ListItem from "@/lib/model/listItem";
import { api } from "@/lib/api";
import { addSnackbar } from "../Snackbar";

export default function Priority({ isComplete, startingPriority, itemId }: { isComplete: boolean, startingPriority: ListItem['priority'], itemId: string }) {
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
    <div className='-mt-2 -mb-2'>
      <Select
        isDisabled={isComplete}
        variant='flat' 
        labelPlacement='outside' 
        size='sm' 
        className={'w-28 grow-0 shrink-0'}
        label={<span className='ml-2 text-foreground'>Priority</span>}
        placeholder='Select...' 
        selectedKeys={priority}
        onSelectionChange={updatePriority}
        color={`${(priority == 'all' || priority.has('High')) ? 'danger' : priority.has('Medium') ? 'warning' : priority.has('Low') ? 'success' : 'default'}`}
      >
        <SelectItem key='High' value='High' color='danger'>High</SelectItem>
        <SelectItem key='Medium' value='Medium' color='warning'>Medium</SelectItem>
        <SelectItem key='Low' value='Low' color='success'>Low</SelectItem>
      </Select>
    </div>
  );
}