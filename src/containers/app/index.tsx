import {Global, css} from '@emotion/core';
import React from 'react';
import {load} from 'components/loading-container';
import {Exercise} from 'containers/exercise';
import {PageLayout} from 'containers/page-layout';
import {urlParams} from 'observables/url-params';
import {fonts} from './fonts';

const globalStyles = css`
    html,
    body,
    #root {
        margin: 0;
        height: 100%;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        font-family: 'Segoe UI Web (West European)', Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue,
            sans-serif;
        font-size: 16px;
    }
    ${fonts}
`;

export function App() {
    return (
        <>
            <Global styles={globalStyles} />
            <PageLayout>
                {load(urlParams.observable$, (params) => (
                    <Exercise key={params.exercise} exerciseNumber={Number(params.exercise)} />
                ))}
            </PageLayout>
        </>
    );
}
