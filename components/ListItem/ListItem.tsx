import { Reorder, useDragControls } from 'framer-motion';

import ListItemModel from '@/lib/model/listItem';
import { NamedColor } from '@/lib/model/color';
import Tag from '@/lib/model/tag';
import ListMember from '@/lib/model/listMember';

import StaticListItem from './StaticListItem';

export default function ListItem({
  item,
  members,
  tagsAvailable,
  hasTimeTracking,
  hasDueDates,
  setStatus,
  setPaused,
  setCompleted,
  updateDueDate,
  updatePriority,
  updateExpectedMs,
  deleteItem,
  addNewTag,
  reorder
}: {
  item: ListItemModel;
  members: ListMember[];
  tagsAvailable: Tag[];
  hasTimeTracking: boolean;
  hasDueDates: boolean;
  setStatus: (status: ListItemModel['status']) => unknown;
  setPaused: () => unknown;
  setCompleted: (date: ListItemModel['dateCompleted']) => unknown;
  updateDueDate: (date: Date) => unknown;
  updatePriority: (priority: ListItemModel['priority']) => unknown;
  updateExpectedMs: (ms: number) => unknown;
  deleteItem: () => unknown;
  addNewTag: (name: string, color: NamedColor) => Promise<string>;
  reorder: () => unknown;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={item.id}
      className='border-b-1 border-content3 last:border-b-0'
      dragControls={controls}
      dragListener={false}
      value={item}
      onDragEnd={reorder}
    >
      <StaticListItem
        addNewTag={addNewTag}
        deleteItem={deleteItem}
        hasDueDates={hasDueDates}
        hasTimeTracking={hasTimeTracking}
        item={item}
        members={members}
        reorderControls={controls}
        setCompleted={setCompleted}
        setPaused={setPaused}
        setStatus={setStatus}
        tagsAvailable={tagsAvailable}
        updateDueDate={updateDueDate}
        updateExpectedMs={updateExpectedMs}
        updatePriority={updatePriority}
      />
    </Reorder.Item>
  );
}
