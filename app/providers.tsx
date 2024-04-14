'use client'

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';

export function Providers({children}: { children: React.ReactNode }) {
    const router = useRouter();
    
    return (
        <NextUIProvider navigate={router.push}>
            <ThemeProvider attribute='class' defaultTheme='system'>
                {children}
            </ThemeProvider>
        </NextUIProvider>
    );
}