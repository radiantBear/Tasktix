import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, useDisclosure } from "@nextui-org/react";
import { useContext } from "react";
import { TrashFill, GearWideConnected } from "react-bootstrap-icons";
import { CalendarMinus, Sliders2, StopwatchFill, SortDown } from "react-bootstrap-icons";
import { addSnackbar } from "../Snackbar";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ListContext } from "../Sidebar";

export function ListSettings({ listId, hasTimeTracking, isAutoOrdered, hasDueDates, setHasTimeTracking, setHasDueDates, setIsAutoOrdered }: { listId: string, hasTimeTracking: boolean, hasDueDates: boolean, isAutoOrdered: boolean, setHasTimeTracking: (value: boolean) => any, setHasDueDates: (value: boolean) => any, setIsAutoOrdered: (value: boolean) => any }) {
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
  
  return (
    <>
      <Button onPress={onOpen} variant='ghost' size='lg' isIconOnly className='bg-content1 shadow-lg shadow-content2'>
        <GearWideConnected aria-label='Settings' size={20} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="justify-center">List Settings</ModalHeader>
          <ModalBody>
            <Switch isSelected={hasTimeTracking} onValueChange={updateHasTimeTracking} size='sm'>Track completion time</Switch>
            <Switch isSelected={hasDueDates} onValueChange={updateHasDueDates} size='sm'>Track due dates</Switch>
            <Switch isSelected={isAutoOrdered} onValueChange={updateIsAutoOrdered} size='sm'>Auto-order list items</Switch>
          </ModalBody>
          <ModalFooter>
          <Button onPress={deleteList} startContent={<TrashFill />} variant='ghost' color='danger'>Delete list</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}