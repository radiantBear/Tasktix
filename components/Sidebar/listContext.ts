import { createContext, Dispatch } from 'react';

import { Action } from './types';

export const ListContext = createContext<Dispatch<Action>>(_ => _);
