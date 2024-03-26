'use client';

import { Button, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import Snackbar from '@/components/snackbar';


export let setLoggedIn: () => void;
export let setLoggedOut: () => void;

export default function Body({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  setLoggedIn = () => setIsLoggedIn(true);
  setLoggedOut = () => setIsLoggedIn(false);
  
  return (
    <>
      <Navbar maxWidth='xl'>
        <NavbarBrand as={Link} href="/" className='flex flex-row justify-left items-center gap-2'>
          <Image src='/logo.png' width={100} alt='logo' style={{borderRadius: 0}} />
        </NavbarBrand>
        <NavbarContent className='justify-center'>
          <NavbarItem>
            {/* Expandable filler */}
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end'>
          <AccountButton isLoggedIn={isLoggedIn} />
        </NavbarContent>
      </Navbar>

      {children}

      <Snackbar />
    </>
  );
}

function AccountButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  function handleClick() {
    api.delete('/session')
      .catch(_ => {})
      .finally(() => {
        setLoggedOut();
        router.replace('/');
      });
  }

  if(!isLoggedIn)
    return (
      <Button as={Link} color="primary" href="/login" variant="flat">
        Log In
      </Button>
    )
  
  return (
    <Button onPress={handleClick} color="primary" href="/logout" variant="flat">
      Log Out
    </Button>
  )
}