import type { Metadata } from 'next';
import { Providers } from './providers';
import Body from '@/app/body';

import './globals.css';
import { getUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Tasktix',
  description: 'For all your to-do needs!'
} as const;

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <Providers>
          <Body isLoggedInAtStart={!!(await getUser())}>{children}</Body>
        </Providers>
      </body>
    </html>
  );
}
