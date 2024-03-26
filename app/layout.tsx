import type { Metadata } from 'next';
import { Providers } from './providers';
import Body from '@/components/body';

import './globals.css';


export const metadata: Metadata = {
  title: 'Tasktix',
  description: 'For all your to-do needs!',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang='en' className='dark'>
      <body >
        <Providers>
          <Body>
            {children}
          </Body>
        </Providers>
      </body>
    </html>
  );
}
