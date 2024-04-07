import { Button } from '@nextui-org/react';
import { PauseFill, PlayFill } from 'react-bootstrap-icons';
import ListItem from '@/lib/model/listItem';

export default function TimeButton({ status, startRunning, pauseRunning }: { status: ListItem['status'], startRunning: () => any, pauseRunning: () => any}) {
  const playBtn = <PlayFill className='shrink-0' />;
  const pauseBtn = <PauseFill className='shrink-0' />;
  
  switch(status) {
    case 'Unstarted':
      return <Button tabIndex={0} color='primary' variant='ghost' className='w-24' startContent={playBtn} onPress={startRunning}>Start</Button>;
    case 'In Progress':
      return <Button tabIndex={0} color='warning' variant='ghost' className='w-24' startContent={pauseBtn} onPress={pauseRunning}>Pause</Button>;
    case 'Paused':
    case 'Completed':
      return <Button tabIndex={status == 'Completed' ? 1 : 0} color='primary' variant='ghost' className='w-24' startContent={playBtn} isDisabled={status == 'Completed'} onPress={startRunning}>Resume</Button>;
  }
}