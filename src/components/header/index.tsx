import styled from '@emotion/styled';
import React from 'react';
import {TsLogo} from 'components/header/ts-logo';
import {ThemeToggle} from 'components/theme-toggle';

const HeaderWrapper = styled.header`
    display: flex;
    flex: 0 0 auto;
    background: #294e80;
    padding: 10px 16px;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
`;

const HeaderLogo = styled.h1`
    margin: 0;
    padding: 0;
    font-weight: 300;
    color: white;
    font-family: Helvetica, Arial, serif;
    letter-spacing: -1px;
    font-size: 30px;
    strong {
        font-weight: 500;
    }
    svg {
        margin-right: 10px;
        position: relative;
        top: 3px;
    }
`;

const HeaderSubLogo = styled.span`
    font-size: 24px;
    margin-left: 20px;
    color: yellow;
    opacity: 0.9;
`;

export function Header() {
    return (
        <HeaderWrapper>
            <HeaderLogo>
                <TsLogo />
                TypeScript
                <HeaderSubLogo>exercises</HeaderSubLogo>
            </HeaderLogo>
            <ThemeToggle />
        </HeaderWrapper>
    );
}
