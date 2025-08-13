import { Filters, InputAction } from './types';

export default function searchReducer(
  state: Filters,
  action: InputAction
): Filters {
  let newState = structuredClone(state);

  switch (action.type) {
    case 'Add':
    case 'Update':
      newState[action.label] = action.value;
      break;

    case 'Remove':
      delete newState[action.label];
      break;

    case 'Clear':
      newState = {};
      break;
  }

  action.callback(newState);

  return newState;
}
