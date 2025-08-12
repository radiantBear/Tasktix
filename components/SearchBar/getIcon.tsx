import {
  CalendarEventFill,
  ChevronDown,
  InputCursorText,
  StopwatchFill,
  Toggle2On
} from 'react-bootstrap-icons';
import { ReactElement } from 'react';

import { InputOption } from './types';

export function getIcon(type: InputOption['type']): ReactElement {
  switch (type) {
    case 'String':
      return <InputCursorText />;

    case 'Select':
      return <ChevronDown />;

    case 'Date':
      return <CalendarEventFill />;

    case 'Time':
      return <StopwatchFill />;

    case 'Toggle':
      return <Toggle2On />;
  }
}
