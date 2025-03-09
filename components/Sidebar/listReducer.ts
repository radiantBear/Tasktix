import List from '@/lib/model/list';
import { Action } from './types';

export default function listReducer(lists: List[], action: Action) {
  switch (action.type) {
    case 'add':
      if (!action.name || !action.color)
        throw Error('Missing required action parameters');
      return [
        ...lists,
        new List(action.name, action.color, [], [], true, true, true, action.id)
      ];

    case 'remove':
      return lists.filter(list => list.id != action.id);

    default:
      throw Error(`Unknown action ${action.type}`);
  }
}
