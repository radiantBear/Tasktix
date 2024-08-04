'use client';

import SearchBar from '@/components/SearchBar/SearchBar';
import { ListSection } from '@/components/List';
import { ListSettings } from '@/components/List/ListSettings';
import { Button, Chip, Tab, Tabs } from '@nextui-org/react';

export default function Page() {
  return (
    <main className='p-8 w-full flex flex-col gap-8 overflow-y-scroll'>
      <span className='flex flex-col gap-4'>
        <span className='flex gap-4 items-center'>
          <Chip color='primary' onClose={_ => _} variant='shadow'>Tasktix</Chip>
          <Chip color='secondary' onClose={_ => _} variant='shadow'>Personal</Chip>
          <Button color='success' size='sm' variant='flat'>Add...</Button>
        </span>
        <span className='flex gap-4 items-center'>
          <SearchBar inputOptions={[]} onValueChange={_ => _} />
          <ListSettings listId='' hasTimeTracking={true} isAutoOrdered={true} hasDueDates={true}  setHasTimeTracking={ _ => _ } setIsAutoOrdered={ _ => _ } setHasDueDates={ _ => _ } />
        </span>
        <Tabs variant='underlined'>
          <Tab title="All" />
          <Tab title="Saved filter 1" />
          <Tab title="Saved filter 2" />
        </Tabs>
      </span>

      {/* 
        * Section options: 
        *   - Mirror sections from lists (combine by name, not ID)
        *   - Custom sections
        *   - No sections
        * 
        * Item adding options:
        *   - Automatic (if sections mirrored then into section, else into Uncategorized)
        *   - Manual (can add to each section using the "+" button; opens modal with all unadded items)
        */}
      <ListSection
        id='' listId='' name='Section'
        members={[]} startingItems={[]} tagsAvailable={[]}
        hasTimeTracking={true} hasDueDates={true} isAutoOrdered={true}
        filters={[]}
        deleteSection={() => null} addNewTag={_ => _} 
      />
    </main>
  );
}