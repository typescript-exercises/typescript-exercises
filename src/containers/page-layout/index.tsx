import styled from '@emotion/styled';
import React from 'react';
import {Footer} from 'components/footer';
import {Header} from 'components/header';
import {Navigation} from 'containers/navigation';

const PageLayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const PageLayoutMain = styled.main`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    position: relative;
`;

export function PageLayout({children}: {children: React.ReactNode}) {
    return (
        <PageLayoutWrapper>
            <Header />
            <Navigation />
            <PageLayoutMain>{children}</PageLayoutMain>
            <Footer />
        </PageLayoutWrapper>
    );
}
