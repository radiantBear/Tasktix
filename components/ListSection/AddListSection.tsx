import { api } from "@/lib/api";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { addSnackbar } from "../Snackbar";

export default function AddListSection({ listId }: { listId: string }) {
  const [name, setName] = useState('');
  
  function addListSection() {
    api.post(`/list/${listId}/section`, { name })
      .then(res => {
        setName('');
        addSnackbar(res.message, 'success')
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  return (
    <div className='rounded-md w-100 overfLow-hidden border-1 border-content3 bg-content1 p-4 h-18 flex items-center justify-center gap-4'>
      <Input placeholder='Name' value={name} onValueChange={setName} variant='underlined' className='w-52' />
      <Button variant='flat' color='primary' onPress={addListSection}>Add Section</Button>
    </div>
  );
}