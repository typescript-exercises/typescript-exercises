import '@emotion/react';

declare module '@emotion/react' {
    export interface Theme {
        style: 'light' | 'dark';
        background: string;
        color: string;
    }
}
