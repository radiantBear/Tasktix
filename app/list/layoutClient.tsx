'use client';

import { ReactNode, useReducer } from 'react';

import Sidebar, { listReducer, ListContext } from '@/components/Sidebar';

export default function LayoutClient({
  startingLists,
  children
}: {
  startingLists: string;
  children: ReactNode;
}) {
  const [lists, dispatchEvent] = useReducer(
    listReducer,
    JSON.parse(startingLists)
  );

  return (
    <ListContext.Provider value={dispatchEvent}>
      <div className='flex h-1/4 grow'>
        <Sidebar lists={lists} />
        {children}
      </div>
    </ListContext.Provider>
  );
}
