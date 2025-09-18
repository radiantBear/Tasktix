/**
 * Tasktix: A powerful and flexible task-tracking tool for all.
 * Copyright (C) 2025 Nate Baird & other Tasktix contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
