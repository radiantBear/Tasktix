import type { Metadata } from 'next';
import { Providers } from './providers';
import Body from '@/components/body';

import './globals.css';
import { getUser } from '@/lib/session';


export const metadata: Metadata = {
  title: 'Tasktix',
  description: 'For all your to-do needs!',
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang='en' className='dark'>
      <body >
        <Providers>
          <Body isLoggedInAtStart={!!await getUser()}>
            {children}
          </Body>
        </Providers>
      </body>
    </html>
  );
}
