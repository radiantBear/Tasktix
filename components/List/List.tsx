'use client';

import ListSection from './ListSection';
import AddListSection from '@/components/AddListSection';
import { addSnackbar } from '@/components/Snackbar';
import { default as api } from '@/lib/api';
import { default as ListModel } from '@/lib/model/list';
import { default as ListSectionModel } from '@/lib/model/listSection';
import Tag from '@/lib/model/tag';
import { NamedColor } from '@/lib/model/color';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import {
  Filters,
  InputOption,
  InputOptionGroup
} from '@/components/SearchBar/types';
import { ListSettings } from './ListSettings';

export default function List({
  startingList,
  startingTagsAvailable
}: {
  startingList: string;
  startingTagsAvailable: string;
}) {
  const builtList: ListModel = JSON.parse(startingList);
  for (const section of builtList.sections) {
    for (const item of section.items) {
      item.dateCreated = new Date(item.dateCreated);
      item.dateDue = item.dateDue ? new Date(item.dateDue) : null;
      item.dateStarted = item.dateStarted ? new Date(item.dateStarted) : null;
      item.dateCompleted = item.dateCompleted
        ? new Date(item.dateCompleted)
        : null;
    }
  }

  const [list, setList] = useState<ListModel>(builtList);
  const [tagsAvailable, setTagsAvailable] = useState<Tag[]>(
    JSON.parse(startingTagsAvailable)
  );
  const [filters, setFilters] = useState<Filters>([]);

  const filterOptions = getFilterOptions(list, tagsAvailable);

  function addNewTag(name: string, color: NamedColor) {
    return new Promise((resolve, reject) => {
      api
        .post(`/list/${list.id}/tag`, { name, color })
        .then(res => {
          const id = res.content?.split('/').at(-1) || '';
          const newTags = structuredClone(tagsAvailable || []);
          newTags.push(new Tag(name, color, id));
          setTagsAvailable(newTags);

          resolve(id);
        })
        .catch(err => reject(err));
    });
  }

  function addListSection(section: ListSectionModel) {
    if (!list) return;

    const newList = structuredClone(list);
    newList.sections.push(section);
    setList(newList);
  }

  function deleteListSection(id: string) {
    if (
      !confirm(
        'Are you sure you want to delete this section? This action is irreversible.'
      )
    )
      return;

    api
      .delete(`/list/${list.id}/section/${id}`)
      .then(res => {
        addSnackbar(res.message, 'success');

        const newList = structuredClone(list);
        for (let i = 0; i < newList.sections.length; i++)
          if (newList.sections[i].id == id) newList.sections.splice(i, 1);
        setList(newList);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <>
      <span className='flex gap-4 items-center'>
        <SearchBar inputOptions={filterOptions} onValueChange={setFilters} />
        <ListSettings
          listId={list.id}
          listName={list.name}
          listColor={list.color}
          tagsAvailable={tagsAvailable}
          setTagsAvailable={setTagsAvailable}
          addNewTag={addNewTag}
          hasTimeTracking={list.hasTimeTracking}
          isAutoOrdered={list.isAutoOrdered}
          hasDueDates={list.hasDueDates}
          setListName={(value: string) => {
            const newList = structuredClone(list);
            newList.name = value;
            setList(newList);
            window.location.reload();
          }}
          setListColor={(value: NamedColor) => {
            const newList = structuredClone(list);
            newList.color = value;
            setList(newList);
          }}
          setHasTimeTracking={(value: boolean) => {
            const newList = structuredClone(list);
            newList.hasTimeTracking = value;
            setList(newList);
          }}
          setIsAutoOrdered={(value: boolean) => {
            const newList = structuredClone(list);
            newList.isAutoOrdered = value;
            setList(newList);
          }}
          setHasDueDates={(value: boolean) => {
            const newList = structuredClone(list);
            newList.hasDueDates = value;
            setList(newList);
          }}
        />
      </span>

      {list.sections.map(section => (
        <ListSection
          key={section.id}
          id={section.id}
          listId={list.id}
          name={section.name}
          members={list.members}
          startingItems={section.items}
          tagsAvailable={tagsAvailable}
          hasTimeTracking={list.hasTimeTracking}
          hasDueDates={list.hasDueDates}
          isAutoOrdered={list.isAutoOrdered}
          filters={filters}
          deleteSection={deleteListSection.bind(null, section.id)}
          addNewTag={addNewTag}
        />
      ))}

      <AddListSection listId={list.id} addListSection={addListSection} />
    </>
  );
}

function getFilterOptions(
  list: ListModel,
  tagsAvailable: Tag[]
): InputOptionGroup[] {
  const generalOptions: InputOption[] = [
    { type: 'String', label: 'name' },
    {
      type: 'Select',
      label: 'priority',
      selectOptions: [
        { name: 'High', color: 'danger' },
        { name: 'Medium', color: 'warning' },
        { name: 'Low', color: 'success' }
      ]
    },
    { type: 'Select', label: 'tag', selectOptions: tagsAvailable }
  ];
  if (list.members.length > 1)
    generalOptions.push({
      type: 'Select',
      label: 'user',
      selectOptions: list.members.map(member => {
        return { name: member.user.username, color: member.user.color };
      })
    });
  if (list.hasTimeTracking)
    generalOptions.push({
      type: 'Select',
      label: 'status',
      selectOptions: [
        { name: 'Unstarted' },
        { name: 'In Progress' },
        { name: 'Paused' },
        { name: 'Completed' }
      ]
    });

  const filterOptions: InputOptionGroup[] = [
    { label: 'General', options: generalOptions },
    {
      label: 'Completed',
      options: [
        { type: 'Date', label: 'completedBefore' },
        { type: 'Date', label: 'completedOn' },
        { type: 'Date', label: 'completedAfter' }
      ]
    }
  ];
  if (list.hasDueDates)
    filterOptions.push({
      label: 'Due',
      options: [
        { type: 'Date', label: 'dueBefore' },
        { type: 'Date', label: 'dueOn' },
        { type: 'Date', label: 'dueAfter' }
      ]
    });
  if (list.hasTimeTracking)
    filterOptions.push(
      {
        label: 'Expected Time',
        options: [
          { type: 'Time', label: 'expectedTimeAbove' },
          { type: 'Time', label: 'expectedTimeAt' },
          { type: 'Time', label: 'expectedTimeBelow' }
        ]
      },
      {
        label: 'Elapsed Time',
        options: [
          { type: 'Time', label: 'elapsedTimeAbove' },
          { type: 'Time', label: 'elapsedTimeAt' },
          { type: 'Time', label: 'elapsedTimeBelow' }
        ]
      }
    );

  return filterOptions;
}
