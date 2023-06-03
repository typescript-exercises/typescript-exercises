import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

const FooterWrapper = styled.footer<{backgroundColor: string}>`
    flex: 0 0 auto;
    border-top: 1px solid #dddddd;
    padding: 5px 0;
    text-align: center;
    color: gray;
    font-size: 12px;
    background-color: ${(props) => props.backgroundColor};
    a,
    a:hover,
    a:visited,
    a:active {
        color: inherit;
    }
    z-index: 1;
`;

const currentYear = new Date().getFullYear();

export function Footer() {
    const theme = useTheme();
    return (
        <FooterWrapper backgroundColor={theme.background}>
            &copy; {currentYear} <a href='https://github.com/mdevils'>Marat Dulin</a>,{' '}
            <a href='https://github.com/typescript-exercises/typescript-exercises'>contribute</a>,{' '}
            <a href='https://github.com/sponsors/mdevils'>support this project</a>
        </FooterWrapper>
    );
}
