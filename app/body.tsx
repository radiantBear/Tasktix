'use client';

import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import Snackbar from '@/components/Snackbar';
import Image from 'next/image';


export let setLoggedIn: () => void;
export let setLoggedOut: () => void;

export default function Body({ children, isLoggedInAtStart }: { children: ReactNode, isLoggedInAtStart: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInAtStart);
  setLoggedIn = () => setIsLoggedIn(true);
  setLoggedOut = () => setIsLoggedIn(false);
  
  return (
    <div className='flex flex-col h-screen'>
      <Navbar maxWidth='full'>
        <NavbarBrand as={Link} href="/" className='flex flex-row justify-left items-center gap-2'>
          <Image src='/logo.png' priority width={100} height={26} alt='Tasktix' style={{borderRadius: 0}} />
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
    </div>
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
      <Button key="signIn" as={Link} color="primary" href="/signIn" variant="flat">
        Sign In
      </Button>
    )
  
  return (
    <Button key="signOut" onPress={handleClick} color="primary" variant="flat">
      Sign Out
    </Button>
  )
}