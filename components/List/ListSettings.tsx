import { Button, Modal, ModalBody, ModalContent, ModalHeader, Spacer, Switch, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { useContext } from 'react';
import { TrashFill, GearWideConnected } from 'react-bootstrap-icons';
import { addSnackbar } from '../Snackbar';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ListContext } from '../Sidebar';
import Tag from '@/lib/model/tag';
import ColorPicker from '../ColorPicker';
import Color from '@/lib/model/color';
import Name from '@/components/Name';
import TagInput from '../TagInput';

export function ListSettings({ listId, tagsAvailable, hasTimeTracking, isAutoOrdered, hasDueDates, setTagsAvailable, setHasTimeTracking, setHasDueDates, setIsAutoOrdered, addNewTag }: { listId: string, tagsAvailable: Tag[], hasTimeTracking: boolean, hasDueDates: boolean, isAutoOrdered: boolean, setTagsAvailable: (value: Tag[]) => any, setHasTimeTracking: (value: boolean) => any, setHasDueDates: (value: boolean) => any, setIsAutoOrdered: (value: boolean) => any, addNewTag: (name: string, color: Color) => any }) {
  const router = useRouter();
  const dispatchEvent = useContext(ListContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function updateHasTimeTracking() {
    api.patch(`/list/${listId}`, { hasTimeTracking: !hasTimeTracking })
      .then(() => setHasTimeTracking(!hasTimeTracking))
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function updateHasDueDates() {
    api.patch(`/list/${listId}`, { hasDueDates: !hasDueDates })
      .then(() => setHasDueDates(!hasDueDates))
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function updateIsAutoOrdered() {
    api.patch(`/list/${listId}`, { isAutoOrdered: !isAutoOrdered })
      .then(() => setIsAutoOrdered(!isAutoOrdered))
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function deleteList() {
    if(!confirm('Are you sure you want to delete this list? This action is irreversible.'))
      return;

    api.delete(`/list/${listId}`)
      .then(res => {
        addSnackbar(res.message, 'success');
        dispatchEvent({ type: 'remove', id: listId })
        router.replace('/list');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function updateTagName(tag: Tag, name: string) {
    api.patch(`/list/${listId}/tag/${tag.id}`, { ...tag, name })
      .then(() => {
        setTagsAvailable(tagsAvailable.map(t => t.id == tag.id ? new Tag(name, t.color, t.id) : t));
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function updateTagColor(tag: Tag, color: Color | null) {
    if(color)
      api.patch(`/list/${listId}/tag/${tag.id}`, { ...tag, color })
      .then(() => {
        setTagsAvailable(tagsAvailable.map(t => t.id == tag.id ? new Tag(t.name, color, t.id) : t));
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function deleteTag(id: string) {
    if (!confirm('This tag will be deleted from all items that currently have it. Are you sure you want to delete the tag?'))
      return;
    
    api.delete(`/list/${listId}/tag/${id}`)
      .then(() => {
        setTagsAvailable(tagsAvailable.filter(tag => tag.id != id));
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  return (
    <>
      <Button onPress={onOpen} variant='ghost' size='lg' isIconOnly className='bg-content1 shadow-lg shadow-content2'>
        <GearWideConnected aria-label='Settings' size={20} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className='h-1/2'>
          <ModalHeader className='justify-center pb-0'>List Settings</ModalHeader>
          <ModalBody className='overflow-clip'>
            <Tabs aria-label='Options' variant='underlined'>
              <Tab title='General' className='flex flex-col gap-4 grow justify-between'>
                <span className='flex flex-col gap-4 overflow-y-scroll'>
                  <Switch isSelected={hasTimeTracking} onValueChange={updateHasTimeTracking} size='sm'>Track completion time</Switch>
                  <Switch isSelected={hasDueDates} onValueChange={updateHasDueDates} size='sm'>Track due dates</Switch>
                  <Switch isSelected={isAutoOrdered} onValueChange={updateIsAutoOrdered} size='sm'>Auto-order list items</Switch>
                </span>
                <span className='flex justify-end'>
                  <Button onPress={deleteList} startContent={<TrashFill />} variant='ghost' color='danger'>Delete list</Button>
                </span>
              </Tab>
              <Tab title='Tags' className='flex flex-col gap-6 grow shrink justify-between overflow-clip'>
                <span className='flex flex-col gap-4 shrink overflow-y-auto'>
                  {
                    tagsAvailable.map(tag => (
                      <span className='flex gap-2 items-center' key={tag.id}>
                        <Name name={tag.name} updateName={updateTagName.bind(null, tag)} showUnderline />
                        <ColorPicker value={tag.color} onValueChange={updateTagColor.bind(null, tag)} />
                        <Button onPress={deleteTag.bind(null, tag.id)} size='sm' variant='ghost' color='danger' isIconOnly><TrashFill /></Button>
                      </span>
                    ))
                  }
                </span>
                <TagInput addNewTag={addNewTag} />
              </Tab>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}