import { Button } from '@nextui-org/react';
import { PauseFill, PlayFill } from 'react-bootstrap-icons';
import Item from '@/lib/model/item';

export default function TimeButton({ status, toggleRunning }: { status: Item['status'], toggleRunning: () => void}) {
  const playBtn = <PlayFill className='shrink-0' />;
  const pauseBtn = <PauseFill className='shrink-0' />;
  
  switch(status) {
    case 'Unstarted':
      return <Button color='primary' variant='ghost' className='w-24' startContent={playBtn} onPress={() => toggleRunning()}>Start</Button>;
    case 'In Progress':
      return <Button color='warning' variant='ghost' className='w-24' startContent={pauseBtn} onPress={() => toggleRunning()}>Pause</Button>;
    case 'Paused':
    case 'Completed':
      return <Button color='primary' variant='ghost' className='w-24' startContent={playBtn} isDisabled={status == 'Completed'} onPress={() => toggleRunning()}>Resume</Button>;
  }
}