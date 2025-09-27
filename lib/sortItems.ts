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

import ListItem from '@/lib/model/listItem';

export function sortItemsByCompleted(a: ListItem, b: ListItem): number {
  if (a.dateCompleted && b.dateCompleted) {
    if (a.dateCompleted < b.dateCompleted) return 1;
    else if (b.dateCompleted < a.dateCompleted) return -1;
    else return 0;
  }

  if (a.status === 'Completed' && b.status !== 'Completed') return 1;
}

export function sortItemsByIndex(a: ListItem, b: ListItem): number {
  if (a.sectionIndex > b.sectionIndex) return 1;
  if (b.sectionIndex > a.sectionIndex) return -1;

  return 0;
}

export function sortItems(
  hasTimeTracking: boolean,
  hasDueDates: boolean,
  a: ListItem,
  b: ListItem
): number {
  const completed_order = sortItemsByCompleted(a, b);

  if (completed_order !== 0) return completed_order;

  if (hasDueDates) {
    if (!a.dateDue) {
      if (b.dateDue) return -1;

      return 0;
    }
    if (!b.dateDue || a.dateDue > b.dateDue) return 1;
    if (b.dateDue > a.dateDue) return -1;
  }

  if (
    (a.priority === 'Low' &&
      (b.priority === 'Medium' || b.priority === 'High')) ||
    (a.priority === 'Medium' && b.priority === 'High')
  )
    return 1;
  if (
    (b.priority === 'Low' &&
      (a.priority === 'Medium' || a.priority === 'High')) ||
    (b.priority === 'Medium' && a.priority === 'High')
  )
    return -1;

  return 0;
}
