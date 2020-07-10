import styled from '@emotion/styled';
import React from 'react';

const FileTitleWrapper = styled.div`
    flex: 0 0 auto;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px #ddd solid;
    background: #eee;
    font-size: 14px;
    color: #0033aa;
`;

const FileTitleLabel = styled.span`
    margin-left: 20px;
    font-size: 12px;
    color: #339900;
`;

export function FileTitle({filename, readOnly}: {filename: string; readOnly: boolean}) {
    return (
        <FileTitleWrapper>
            {filename.replace(/^\//, '')}
            {readOnly && <FileTitleLabel>Read Only</FileTitleLabel>}
        </FileTitleWrapper>
    );
}
