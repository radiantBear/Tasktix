import type { Metadata } from 'next';
import { Providers } from './providers';
import { Button, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import Snackbar from '@/components/snackbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tasktix',
  description: 'For all your to-do needs!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body >
        <Providers>
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
              <Button as={Link} color="primary" href="/login" variant="flat">
                Log In
              </Button>
            </NavbarContent>
          </Navbar>

          {children}
          
          <Snackbar />
        </Providers>
      </body>
    </html>
  );
}
