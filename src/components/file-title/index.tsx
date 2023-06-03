import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

const FileTitleWrapper = styled.div<{backgroundColor: string}>`
    flex: 0 0 auto;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px #ddd solid;
    background: ${(props) => props.backgroundColor};
    font-size: 14px;
    color: ${(props) => (props.backgroundColor === '#1e1e1e' ? '#3a869e' : '#0033aa')};
`;

const FileTitleLabel = styled.span`
    margin-left: 20px;
    font-size: 12px;
    color: #339900;
`;

export function FileTitle({filename, readOnly}: {filename: string; readOnly: boolean}) {
    const theme = useTheme();
    return (
        <FileTitleWrapper backgroundColor={theme.background}>
            {filename.replace(/^\//, '')}
            {readOnly && <FileTitleLabel>Read Only</FileTitleLabel>}
        </FileTitleWrapper>
    );
}
