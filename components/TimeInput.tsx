'use client';

import { formatTime } from '@/lib/date';
import { Input } from '@nextui-org/react';
import { useState } from 'react';

export default function TimeInput({
  label,
  labelPlacement,
  variant,
  color,
  size,
  value,
  autoFocus,
  tabIndex,
  defaultValue,
  className,
  classNames,
  onValueChange
}: {
  label?: string;
  labelPlacement?: 'outside' | 'outside-left' | 'inside';
  variant?: 'flat' | 'faded' | 'bordered' | 'underlined';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
  value?: number;
  defaultValue?: number;
  autoFocus?: boolean;
  tabIndex?: number;
  className?: string;
  classNames?: { label?: string; inputWrapper?: string; input?: string };
  onValueChange?: (value: number) => any;
}) {
  const [time, setTime] = useState(formatTime(defaultValue || 0));

  function updateTime(value: string) {
    value = value.replaceAll(/[^0-9]/g, '');
    const hourStr = value.slice(0, -2);
    const minStr = value.slice(-2);

    setTime(hourStr + ':' + minStr);

    const ms = (Number(hourStr) * 60 + Number(minStr)) * 60 * 1000;
    if (onValueChange) onValueChange(ms);
  }

  return (
    <Input
      autoFocus={autoFocus ?? true}
      label={label}
      labelPlacement={labelPlacement}
      variant={variant}
      color={color}
      size={size}
      value={value != undefined ? formatTime(value) : time}
      onValueChange={updateTime}
      tabIndex={tabIndex}
      className={className}
      classNames={classNames}
    />
  );
}
