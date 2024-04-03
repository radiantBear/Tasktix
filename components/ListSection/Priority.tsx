import { Select, SelectItem, Selection } from "@nextui-org/react";
import { useState } from "react";
import ListItem from "@/lib/model/listItem";

export default function Priority({ isComplete, startingPriority }: { isComplete: boolean, startingPriority: ListItem['priority'] }) {
  const [priority, setPriority] = useState<Selection>(new Set([startingPriority]));
  
  return (
    <div className='-mt-2 -mb-2'>
      <Select
        isDisabled={isComplete}
        variant='flat' 
        labelPlacement='outside' 
        size='sm' 
        className={'w-28'}
        label={<span className='ml-2 text-foreground'>Priority</span>}
        placeholder='Select...' 
        selectedKeys={priority}
        onSelectionChange={setPriority}
        color={`${(priority == 'all' || priority.has('High')) ? 'danger' : priority.has('Medium') ? 'warning' : priority.has('Low') ? 'success' : 'default'}`}
      >
        <SelectItem key='High' value='High' color='danger'>High</SelectItem>
        <SelectItem key='Medium' value='Medium' color='warning'>Medium</SelectItem>
        <SelectItem key='Low' value='Low' color='success'>Low</SelectItem>
      </Select>
    </div>
  );
}