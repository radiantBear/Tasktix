import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useContext } from "react";
import { CalendarMinus, Sliders2, StopwatchFill, TrashFill, SortDown } from "react-bootstrap-icons";
import { addSnackbar } from "../Snackbar";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ListContext } from "../Sidebar";

export function ListSettings({ listId, hasTimeTracking, isAutoOrdered, hasDueDates, setHasTimeTracking, setHasDueDates, setIsAutoOrdered }: { listId: string, hasTimeTracking: boolean, hasDueDates: boolean, isAutoOrdered: boolean, setHasTimeTracking: (value: boolean) => any, setHasDueDates: (value: boolean) => any, setIsAutoOrdered: (value: boolean) => any }) {
  const router = useRouter();
  const dispatchEvent = useContext(ListContext);

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
    <Dropdown>
      <DropdownTrigger>
      <Button variant='ghost' size='lg' isIconOnly className='bg-content1 shadow-lg shadow-content2'>
        <Sliders2 aria-label='Settings' size={20} />
      </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onPress={updateHasTimeTracking} key='toggleTime' startContent={<StopwatchFill />}>{hasTimeTracking ? 'Disable' : 'Enable'} time tracking</DropdownItem>
        <DropdownItem onPress={updateHasDueDates} startContent={<CalendarMinus />}>{hasDueDates ? 'Disable' : 'Enable'} due dates</DropdownItem>
        <DropdownItem onPress={updateIsAutoOrdered} startContent={<SortDown />}>{isAutoOrdered ? 'Disable' : 'Enable'} auto ordering</DropdownItem>
        <DropdownItem onPress={deleteList} startContent={<TrashFill />} className='text-danger' color='danger'>Delete list</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}