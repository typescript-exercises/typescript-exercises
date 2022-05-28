import styled from '@emotion/styled';
import React from 'react';

const FooterWrapper = styled.footer`
    flex: 0 0 auto;
    border-top: 1px solid #294e80;
    padding: 5px 0;
    text-align: center;
    color: gray;
    font-size: 12px;
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
    return (
        <FooterWrapper>
            &copy; {currentYear} <a href='https://github.com/mdevils'>Marat Dulin</a>,{' '}
            <a href='https://github.com/typescript-exercises/typescript-exercises'>contribute</a>,{' '}
            <a href='https://www.patreon.com/mdevils'>support this project</a>
        </FooterWrapper>
    );
}
