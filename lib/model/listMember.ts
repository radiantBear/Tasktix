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

import User from './user';

export default class ListMember {
  user: User;
  canAdd: boolean;
  canRemove: boolean;
  canComplete: boolean;
  canAssign: boolean;

  constructor(
    user: User,
    canAdd: boolean = false,
    canRemove: boolean = false,
    canComplete: boolean = false,
    canAssign: boolean = false
  ) {
    this.user = user;
    this.canAdd = canAdd;
    this.canRemove = canRemove;
    this.canComplete = canComplete;
    this.canAssign = canAssign;
  }
}
