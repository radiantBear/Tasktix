'use client';

import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import Image from 'next/image';

import Snackbar from '@/components/Snackbar';
import { default as api } from '@/lib/api';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export let setLoggedIn: () => void;
export let setLoggedOut: () => void;

export default function Body({
  children,
  isLoggedInAtStart
}: {
  children: ReactNode;
  isLoggedInAtStart: boolean;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInAtStart);

  setLoggedIn = () => setIsLoggedIn(true);
  setLoggedOut = () => setIsLoggedIn(false);

  return (
    <div className='flex flex-col h-screen'>
      <Navbar maxWidth='full'>
        <NavbarBrand
          as={Link}
          className='flex flex-row justify-left items-center gap-2'
          href='/'
        >
          <Image
            priority
            alt='Tasktix'
            height={26}
            src='/logo.png'
            style={{ borderRadius: 0 }}
            width={100}
          />
        </NavbarBrand>
        <NavbarContent className='justify-center'>
          <NavbarItem>{/* Expandable filler */}</NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end'>
          <ThemeSwitcher />
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
    api
      .delete('/session')
      .catch(_ => {})
      .finally(() => {
        setLoggedOut();
        router.replace('/');
      });
  }

  if (!isLoggedIn)
    return (
      <Button
        key='signIn'
        as={Link}
        color='primary'
        href='/signIn'
        variant='flat'
      >
        Sign In
      </Button>
    );

  return (
    <Button key='signOut' color='primary' variant='flat' onPress={handleClick}>
      Sign Out
    </Button>
  );
}
