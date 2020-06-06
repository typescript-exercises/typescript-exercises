import styled from '@emotion/styled';
import {Footer} from 'components/footer';
import {Header} from 'components/header';
import React from 'react';
import { Navigation } from 'containers/navigation';

const PageLayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const PageLayoutMain = styled.main`
    flex: 1 1 auto;
    position: relative;
`;

export function PageLayout({children}: {children: React.ReactNode}) {
    return (
        <PageLayoutWrapper>
            <Header />
            <Navigation />
            <PageLayoutMain>
                {children}
            </PageLayoutMain>
            <Footer />
        </PageLayoutWrapper>
    );
}
