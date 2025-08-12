import { clearTimeout, setTimeout } from 'timers';

import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { Display, MoonFill, SunFill } from 'react-bootstrap-icons';

export default function ThemeSwitcher() {
  const timer = useRef<NodeJS.Timeout>();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [themeIcon, setThemeIcon] = useState(
    theme != 'system'
      ? theme
      : window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
  );

  useEffect(() => {
    setThemeIcon(
      theme != 'system'
        ? theme
        : window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    );
  }, [theme]);

  useEffect(() => setIsMounted(true), []);

  function handleMouse(isHovering: boolean) {
    if (isHovering) {
      clearTimeout(timer.current);
      setIsOpen(true);
    } else timer.current = setTimeout(() => setIsOpen(false), 100);
  }

  return (
    <Popover isOpen={isOpen}>
      <PopoverTrigger
        onMouseLeave={() => handleMouse(false)}
        onMouseOver={() => handleMouse(true)}
      >
        <Button
          isIconOnly
          aria-label={`Set ${themeIcon == 'dark' ? 'light' : 'dark'} theme`}
          variant='ghost'
          onClick={() => setTheme(themeIcon == 'dark' ? 'light' : 'dark')}
        >
          {isMounted && themeIcon == 'dark' ? <SunFill /> : <MoonFill />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onMouseLeave={() => handleMouse(false)}
        onMouseOver={() => handleMouse(true)}
      >
        <Listbox
          aria-label='Choose theme'
          selectedKeys={[theme || 'system']}
          selectionMode='single'
        >
          <ListboxItem
            key='light'
            startContent={<SunFill />}
            onPress={() => setTheme('light')}
          >
            Light
          </ListboxItem>
          <ListboxItem
            key='dark'
            startContent={<MoonFill />}
            onPress={() => setTheme('dark')}
          >
            Dark
          </ListboxItem>
          <ListboxItem
            key='system'
            startContent={<Display />}
            onPress={() => setTheme('system')}
          >
            System
          </ListboxItem>
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
