import React from 'react';
import ReactDOM from 'react-dom';
import {App} from 'containers/app';
import {AppThemeProvider} from './containers/app-theme-provider';

ReactDOM.render(
    <AppThemeProvider>
        <App />
    </AppThemeProvider>,
    document.getElementById('root')
);
