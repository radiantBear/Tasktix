import { formatTime, getDateDiff } from '@/lib/date';
import TimeButton from './TimeButton';
import ListItem from '@/lib/model/listItem';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { addSnackbar } from '@/components/Snackbar';

export default function TimeGroup({ expected, elapsed, dateStarted, status, itemId, setStatus }: { expected: number, elapsed: number, status: ListItem['status'], dateStarted: Date|null, itemId: string, setStatus: (status: ListItem['status']) => void }) {
  const minute = 1000 * 60;
  const isComplete = status == 'Completed';
  
  const timer = useRef<NodeJS.Timeout>();
  const updateTime = useRef(() => {});
  const lastTime = useRef(dateStarted || new Date());
  const [elapsedLive, setElapsedLive] = useState(elapsed + (dateStarted ? Date.now() - dateStarted.getTime() : 0));

  // Stop timer if checkbox was pressed
  if(isComplete)
    stopRunning();

  useEffect(() => {
    updateTime.current = () => {
      timer.current = setTimeout(() => updateTime.current(), minute);
      setElapsedLive(elapsedLive + (Date.now() - lastTime.current.getTime()));
      lastTime.current = new Date();
    }
  });

  function stopRunning() {
    if(timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
      if(lastTime.current)
        setElapsedLive(elapsedLive + (Date.now() - lastTime.current.getTime()));
    }
  }

  function startRunning() {
    api.patch(`/item/${itemId}`, { startTime: new Date(), status: 'In Progress' })
      .then(res => {
        addSnackbar(res.message, 'success');
        lastTime.current = new Date();
        clearTimeout(timer.current);
        timer.current = setTimeout(updateTime.current, minute - elapsedLive % minute + 5);
        setStatus('In Progress');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  function pauseRunning() {
    const newElapsed = elapsedLive + (Date.now() - lastTime.current.getTime());
    api.patch(`/item/${itemId}`, { startTime: null, elapsedMs: newElapsed, status: 'Paused' })
      .then(res => {
        addSnackbar(res.message, 'success');
        stopRunning();
        setElapsedLive(newElapsed);   // Ensure any delay doesn't result in inaccurate time display
        setStatus('Paused');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <>
      <span className='flex gap-4'>
        <span className='flex flex-col items-center'>
          <p className={`text-xs${isComplete ? ' text-foreground/50' : ''}`}>Expected</p>
          <p className={`text-sm${isComplete ? ' text-foreground/50' : ''}`}>{formatTime(expected)}</p>
        </span>
        <span className='border-r-1 border-content3'></span>
        <span className='flex flex-col items-center'>
          <p className={`text-xs${isComplete ? ' text-foreground/50' : ''}`}>Elapsed</p>
          <p className={`text-sm${isComplete ? ' text-foreground/50' : ''}`}>{formatTime(elapsedLive)}</p>
        </span>
      </span>
      <TimeButton status={status} startRunning={startRunning} pauseRunning={pauseRunning} />
    </>
  );
}