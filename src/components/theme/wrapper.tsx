'use client';

import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';

interface AppThemeProviderProps {
    children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
    // Add mounted state to handle hydration
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return null or a loading state on server-side/initial render
    if (!mounted) {
        return null;
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            themes={['light', 'dark']}
            disableTransitionOnChange
            enableColorScheme={true}
            storageKey="gasbygas-theme-setting"
        >
            {children}
        </ThemeProvider>
    );
};