import { formatTime } from '@/lib/date';
import TimeButton from './time_button';
import Item from '@/lib/model/item';
import { useEffect, useRef, useState } from 'react';

export default function Time({ expected, elapsed, status, setStatus }: { expected: Date, elapsed: Date, status: Item['status'], setStatus: (status: Item['status']) => void}) {
  const minute = 1000 * 60;
  const isComplete = status == 'Completed';
  
  const lastTime = useRef(new Date());
  const timer = useRef<NodeJS.Timeout>();
  const updateTime = useRef(() => {});
  const [elapsedLive, setElapsedLive] = useState(elapsed);

  // Stop timer if checkbox was pressed
  if(isComplete)
    stopRunning();

  useEffect(() => {
    updateTime.current = () => {
      timer.current = setTimeout(() => updateTime.current(), minute);
      setElapsedLive(new Date(elapsedLive.getTime() + (Date.now() - lastTime.current.getTime())));
      lastTime.current = new Date();
    }
  });

  function stopRunning() {
    if(timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
      if(lastTime.current)
        setElapsedLive(new Date(elapsedLive.getTime() + (Date.now() - lastTime.current.getTime())));
    }
  }
  
  function toggleRunning() {
    if(status == 'In Progress') {
      stopRunning();
      setStatus('Paused');
    } else {
      setStatus('In Progress');
      lastTime.current = new Date();
      clearTimeout(timer.current);
      timer.current = setTimeout(updateTime.current, minute - elapsedLive.getTime() % minute + 5);
    }
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
      <TimeButton status={status} toggleRunning={toggleRunning} />
    </>
  );
}