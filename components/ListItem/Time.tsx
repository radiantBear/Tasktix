import { formatTime } from "@/lib/date";

export default function Time({ label, ms }: { label: string, ms: number }) {
  return (
    <span className='flex flex-col items-center'>
      <p className={'text-xs'}>{label}</p>
      <p className={'text-sm'}>{formatTime(ms)}</p>
    </span>
  );
}