'use client';

import { Button } from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

export default function CalendarInput({ defaultValue, color = 'default', value, onValueChange }: { placeholder?: string, defaultValue?: Date, displayContent?: ReactNode, color?: 'default'|'primary'|'secondary'|'danger'|'warning'|'success', value?: Date, onValueChange?: (date: Date) => any }) {
  const [date, setDate] = useState(value || defaultValue || null);
  const [currentRange, setCurrentRange] = useState(defaultValue || new Date());

  // Respect the `value` prop if there is one
  useEffect(() => {
    if (value !== undefined) {
      setDate(value);
      setCurrentRange(value);
    }
  }, [value]);

  function handleSelect(date: number) {
    const newDate = new Date(currentRange.getTime());
    newDate.setDate(date);
    
    if(value)
      onValueChange && onValueChange(newDate);
    else
      setDate(newDate);
  }

  // Update the month on the display
  function updateCurrentRange(monthOffset: number) {
    const newDate = new Date(currentRange);
    newDate.setMonth(newDate.getMonth() + monthOffset);
    setCurrentRange(newDate);
  }
  
  return (
    <>
      <div className='flex flex-col bg-content2 w-full p-1'>
        <span className='flex justify-between items-center gap-2'>
          <Button onPress={() => updateCurrentRange(-1)} isIconOnly className='bg-transparent hover:bg-foreground/10'><ChevronLeft /></Button>
          {currentRange.toLocaleString('default', {month: 'short', year: 'numeric'})}
          <Button onPress={() => updateCurrentRange(1)} isIconOnly className='bg-transparent hover:bg-foreground/10'><ChevronRight /></Button>
        </span>
        <span className='flex justify-between px-2'>
          <span className='text-foreground/65'>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span className='text-foreground/65'>S</span>
        </span>
      </div>
      <CalendarInputBody color={color} current={date} month={currentRange} onSelect={handleSelect} />
    </>
  );
}

function CalendarInputBody({ color, current, month, onSelect }: { color: 'default'|'primary'|'secondary'|'danger'|'warning'|'success', current: Date|null, month: Date, onSelect: (value: number) => any }) {
  const isCurrentMonth = 
    current
    && current.getFullYear() == month.getFullYear() 
    && current.getMonth() == month.getMonth();
  const monthNum = month.getMonth();
  
  const monthStart = new Date(month.getTime());
  monthStart.setDate(1);
  const monthEnd = new Date(month.getTime());
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  monthEnd.setDate(0);

  const before = monthStart.getDay();
  const blanks = [];
  for(let i = 0; i < before; i++)
    blanks.push(<div key={`blank${i}`} className='w-6 min-w-6 h-6 min-h-6'></div>);

  let hoverColor = 'data-[hover=true]:text-default';
  switch(color) {
    case 'primary':
      hoverColor = 'data-[hover=true]:text-primary';
      break;
    case 'secondary':
      hoverColor = 'data-[hover=true]:text-secondary';
      break;
    case 'danger':
      hoverColor = 'data-[hover=true]:text-danger';
      break;
    case 'warning':
      hoverColor = 'data-[hover=true]:text-warning';
      break;
    case 'success':
      hoverColor = 'data-[hover=true]:text-success';
      break;
  }

  const days = [];
  for(let i = 1; i <= monthEnd.getDate(); i++)
    if(isCurrentMonth && current.getDate() == i)
      days.push(<Button key={`${monthNum}:${i}`} variant='solid' onPress={() => onSelect(i)} className='w-6 min-w-6 h-6 min-h-6 rounded-md' color={color} isIconOnly>{i}</Button>)
    else
      days.push(<Button key={`${monthNum}:${i}`} variant='light' onPress={() => onSelect(i)} className={`w-6 min-w-6 h-6 min-h-6 rounded-md ${[0, 6].includes((before + i - 1) % 7) ? 'text-foreground/65' : 'text-foreground'} ${hoverColor}`} color={color} isIconOnly>{i}</Button>)
    
  return (
    <div className='grid grid-cols-7 w-full gap-1 p-1'>
      {blanks}
      {days}
    </div>
  );
}