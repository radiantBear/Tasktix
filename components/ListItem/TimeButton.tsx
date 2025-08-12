import { Button } from '@nextui-org/react';
import { PauseFill, PlayFill } from 'react-bootstrap-icons';

import ListItem from '@/lib/model/listItem';

export default function TimeButton({
  status,
  startRunning,
  pauseRunning
}: {
  status: ListItem['status'];
  startRunning: () => any;
  pauseRunning: () => any;
}) {
  const playBtn = <PlayFill className='shrink-0' />;
  const pauseBtn = <PauseFill className='shrink-0' />;

  switch (status) {
    case 'Unstarted':
      return (
        <Button
          className='w-24'
          color='primary'
          startContent={playBtn}
          tabIndex={0}
          variant='ghost'
          onPress={startRunning}
        >
          Start
        </Button>
      );
    case 'In Progress':
      return (
        <Button
          className='w-24'
          color='warning'
          startContent={pauseBtn}
          tabIndex={0}
          variant='ghost'
          onPress={pauseRunning}
        >
          Pause
        </Button>
      );
    case 'Paused':
    case 'Completed':
      return (
        <Button
          className='w-24'
          color='primary'
          isDisabled={status == 'Completed'}
          startContent={playBtn}
          tabIndex={status == 'Completed' ? 1 : 0}
          variant='ghost'
          onPress={startRunning}
        >
          Resume
        </Button>
      );
  }
}
