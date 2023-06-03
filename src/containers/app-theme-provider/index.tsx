import {ThemeProvider} from '@emotion/react';
import React, {createContext, ReactNode, useCallback, useContext, useMemo, useState} from 'react';
import {darkTheme, lightTheme} from 'styles/themes';

export type AppTheme = 'light' | 'dark';

interface AppThemeContextValue {
    theme: AppTheme;
    setTheme(theme: AppTheme | ((prev: AppTheme) => AppTheme)): void;
}

const AppThemeContext = createContext<AppThemeContextValue>({
    theme: 'light',
    setTheme: () => null
});

export function AppThemeProvider({children}: {children: ReactNode}) {
    const [theme, setTheme] = useState<AppTheme>(() => {
        if (localStorage.getItem('theme')) {
            return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
        }
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (e) {
            // ok
        }
        return 'light';
    });
    const setThemeAndUpdateLocalStorage = useCallback(
        (value: AppTheme | ((prev: AppTheme) => AppTheme)) => {
            setTheme((prev) => {
                const newValue = typeof value === 'function' ? value(prev) : value;
                localStorage.setItem('theme', newValue);
                return newValue;
            });
        },
        [setTheme]
    );
    const value = useMemo(
        () => ({theme, setTheme: setThemeAndUpdateLocalStorage}),
        [theme, setThemeAndUpdateLocalStorage]
    );
    return (
        <AppThemeContext.Provider value={value}>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>{children}</ThemeProvider>
        </AppThemeContext.Provider>
    );
}

export function useAppTheme(): AppThemeContextValue {
    return useContext(AppThemeContext);
}
