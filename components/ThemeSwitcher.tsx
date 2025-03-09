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
import { clearTimeout, setTimeout } from 'timers';

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
        onMouseOver={() => handleMouse(true)}
        onMouseLeave={() => handleMouse(false)}
      >
        <Button
          onClick={() => setTheme(themeIcon == 'dark' ? 'light' : 'dark')}
          aria-label={`Set ${themeIcon == 'dark' ? 'light' : 'dark'} theme`}
          variant='ghost'
          isIconOnly
        >
          {isMounted && themeIcon == 'dark' ? <SunFill /> : <MoonFill />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onMouseOver={() => handleMouse(true)}
        onMouseLeave={() => handleMouse(false)}
      >
        <Listbox
          selectionMode='single'
          selectedKeys={[theme || 'system']}
          aria-label='Choose theme'
        >
          <ListboxItem
            key='light'
            onPress={() => setTheme('light')}
            startContent={<SunFill />}
          >
            Light
          </ListboxItem>
          <ListboxItem
            key='dark'
            onPress={() => setTheme('dark')}
            startContent={<MoonFill />}
          >
            Dark
          </ListboxItem>
          <ListboxItem
            key='system'
            onPress={() => setTheme('system')}
            startContent={<Display />}
          >
            System
          </ListboxItem>
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
