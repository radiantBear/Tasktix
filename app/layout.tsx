import type { Metadata } from 'next';

import Body from '@/app/body';
import { getUser } from '@/lib/session';

import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tasktix',
  description: 'For all your to-do needs!'
} as const;

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body>
        <Providers>
          <Body isLoggedInAtStart={!!(await getUser())}>{children}</Body>
        </Providers>
      </body>
    </html>
  );
}
