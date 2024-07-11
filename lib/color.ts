import Color from '@/lib/model/color';

export function getTextColor(color: Color): string {
  switch(color) {
    case 'danger':
      return 'text-danger';
    case 'warning':
      return 'text-warning';
    case 'success':
      return 'text-success';
    case 'Pink':
      return 'text-pink-500';
    case 'Red':
      return 'text-red-500';
    case 'Orange':
      return 'text-orange-500';
    case 'Amber':
      return 'text-amber-500';
    case 'Yellow':
      return 'text-yellow-500';
    case 'Lime':
      return 'text-lime-500';
    case 'Green':
      return 'text-green-500';
    case 'Emerald':
      return 'text-emerald-500';
    case 'Cyan':
      return 'text-cyan-500';
    case 'Blue':
      return 'text-blue-500';
    case 'Violet':
      return 'text-violet-500';
  }
}

export function getBackgroundColor(color: Color): string {
  switch(color) {
    case 'danger':
      return 'bg-danger';
    case 'warning':
      return 'bg-warning';
    case 'success':
      return 'bg-success';
    case 'Pink':
      return 'bg-pink-500';
    case 'Red':
      return 'bg-red-500';
    case 'Orange':
      return 'bg-orange-500';
    case 'Amber':
      return 'bg-amber-500';
    case 'Yellow':
      return 'bg-yellow-500';
    case 'Lime':
      return 'bg-lime-500';
    case 'Green':
      return 'bg-green-500';
    case 'Emerald':
      return 'bg-emerald-500';
    case 'Cyan':
      return 'bg-cyan-500';
    case 'Blue':
      return 'bg-blue-500';
    case 'Violet':
      return 'bg-violet-500';
  }
}

export function randomColor(): Color {
  const colors: Color[] = [
    'Pink',
    'Red',
    'Orange',
    'Amber',
    'Yellow',
    'Lime',
    'Green',
    'Emerald',
    'Cyan',
    'Blue',
    'Violet'
  ];

  const index = Math.floor(Math.random() * colors.length);

  return colors[index];
}