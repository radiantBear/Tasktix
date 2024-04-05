import { formatTime } from '@/lib/date';
import TimeButton from './TimeButton';
import ListItem from '@/lib/model/listItem';

export default function TimeGroup({ expected, elapsed, status, startRunning, pauseRunning }: { expected: number, elapsed: number, status: ListItem['status'], startRunning: () => any, pauseRunning: () => any }) {
  const isComplete = status == 'Completed';

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
          <p className={`text-sm${isComplete ? ' text-foreground/50' : ''}`}>{formatTime(elapsed)}</p>
        </span>
      </span>
      <TimeButton status={status} startRunning={startRunning} pauseRunning={pauseRunning} />
    </>
  );
}