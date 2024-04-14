import { Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { Display, MoonFill, SunFill } from "react-bootstrap-icons";
import { clearTimeout, setTimeout } from "timers";

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout>();
  const { theme, setTheme } = useTheme();
  
  const currentTheme = theme != 'system' 
    ? theme 
    : document.getElementsByTagName('html')[0].classList.contains('light')
      ? 'light'
      : 'dark';

  function handleMouse(isHovering: boolean) {
    if(isHovering) {
      clearTimeout(timer.current);
      setIsOpen(true);
    }
    else
      timer.current = setTimeout(() => setIsOpen(false), 100);
  }

  return (
    <Popover isOpen={isOpen}>
      <PopoverTrigger onMouseOver={() => handleMouse(true)} onMouseLeave={() => handleMouse(false)}>
        <Button onClick={() => setTheme(currentTheme == 'dark' ? 'light' : 'dark')} variant='ghost' isIconOnly>
          {
            currentTheme == 'dark'
              ? <SunFill />
              : <MoonFill />
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent onMouseOver={() => handleMouse(true)} onMouseLeave={() => handleMouse(false)}>
        <Listbox selectionMode='single' selectedKeys={[ theme || 'system' ]}>
          <ListboxItem key='light' onPress={() => setTheme('light')} startContent={<SunFill />}>Light</ListboxItem>
          <ListboxItem key='dark' onPress={() => setTheme('dark')} startContent={<MoonFill />}>Dark</ListboxItem>
          <ListboxItem key='system' onPress={() => setTheme('system')} startContent={<Display />}>System</ListboxItem>
        </Listbox>
      </PopoverContent>
    </Popover>
  )
}