import React from 'react';
import ReactDOM from 'react-dom';
import {App} from 'containers/app';
import {AppThemeProvider} from './containers/app-theme-provider';

ReactDOM.render(
    <React.StrictMode>
        <AppThemeProvider>
            <App />
        </AppThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
