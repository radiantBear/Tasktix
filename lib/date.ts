export function getDateDiff(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

export function getDayOffset(date: Date): number {
  const day = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.trunc(getDateDiff(date, today) / day);
}

export function formatDate(date: Date): string {
  const distant: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  const close: Intl.DateTimeFormatOptions = {
    weekday: 'long'
  }

  const dayOffset = getDayOffset(date);
  const isThisWeek = (dayOffset < 7) && (date.getDay() > (new Date()).getDay());

  if(dayOffset == 0)
    return 'Today';
  else if(dayOffset == 1)
    return 'Tomorrow';
  else if(dayOffset == -1)
    return 'Yesterday';
  else if(dayOffset > 0 && (dayOffset < 4 || isThisWeek))
    return date.toLocaleDateString('en-US', close);
  else
    return date.toLocaleDateString('en-US', distant);
}

export function formatTime(time: number): string {
  let hours = Math.trunc(time / 3600000).toString();
  let minutes = Math.round(time / 60000).toString();

  if(hours.length < 1)
    hours = '00';
  else if(hours.length < 2)
    hours = '0'+hours;

  if(minutes.length < 1)
    minutes = '00';
  else if(minutes.length < 2)
    minutes = '0'+minutes;

  return `${hours}:${minutes}`;
}

export function inputToDate(date: string): Date {
  const [year, month, day] = date.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function dateToInput(date: Date): string {
  const year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  if(month.length < 2)
    month = '0' + month;
  if(day.length < 2)
    day = '0' + day;

  return `${year}-${month}-${day}`;
}

export function parseTime(time: string): number {
  const [hours, minutes, seconds] = time.split(':');
  return ((Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds)) * 1000;
}