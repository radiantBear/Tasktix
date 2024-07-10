import ListItemModel from '@/lib/model/listItem';
import Color from '@/lib/model/color';
import Tag from '@/lib/model/tag';
import ListMember from '@/lib/model/listMember';
import { Reorder, useDragControls } from 'framer-motion';
import StaticListItem from './StaticListItem';

export default function ListItem({ item, members, tagsAvailable, hasTimeTracking, hasDueDates, setStatus, setPaused, setCompleted, updateDueDate, updatePriority, updateExpectedMs, deleteItem, addNewTag, reorder }: { item: ListItemModel, members: ListMember[], tagsAvailable: Tag[], hasTimeTracking: boolean, hasDueDates: boolean, setStatus: (status: ListItemModel['status']) => any, setPaused: () => any, setCompleted: (date: ListItemModel['dateCompleted']) => any, updateDueDate: (date: Date) => any, updatePriority: (priority: ListItemModel['priority']) => any, updateExpectedMs: (ms: number) => any, deleteItem: () => any, addNewTag: (name: string, color: Color) => any, reorder: () => any }) {  
  const controls = useDragControls();

  return (
    <Reorder.Item key={item.id} value={item} dragListener={false} dragControls={controls} onDragEnd={reorder} className='border-b-1 border-content3 last:border-b-0'>
      <StaticListItem reorderControls={controls} item={item} members={members} tagsAvailable={tagsAvailable} hasTimeTracking={hasTimeTracking} hasDueDates={hasDueDates} setStatus={setStatus} setPaused={setPaused} setCompleted={setCompleted} updateDueDate={updateDueDate} updatePriority={updatePriority} updateExpectedMs={updateExpectedMs} deleteItem={deleteItem} addNewTag={addNewTag} />
    </Reorder.Item>
  );
}