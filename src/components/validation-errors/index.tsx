import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import {ValidationError} from 'lib/validation-error';

const ValidationErrorsWrapper = styled.ol<{color: string}>`
    padding: 0;
    margin: 5px 0 5px 40px;
    list-style: none;
    counter-reset: errors;
    color: ${(props) => props.color};
`;

const ValidationErrorsItem = styled.li`
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
    cursor: pointer;
    & + & {
        margin-top: 10px;
    }
    &:hover {
        text-decoration: underline;
    }
    &::before {
        counter-increment: errors;
        content: counter(errors) '.';
        display: inline-block;
        width: 30px;
        text-align: right;
        margin-right: 10px;
        margin-left: -40px;
        color: gray;
    }
`;

export const ValidationErrors = React.memo(function ValidationErrors({
    errors,
    onClick
}: {
    errors: ValidationError[];
    onClick: (error: ValidationError) => void;
}) {
    const theme = useTheme();
    return (
        <ValidationErrorsWrapper color={theme.color}>
            {errors.map((error, index) => (
                <ValidationErrorsItem key={index} onClick={() => onClick(error)}>
                    {error.messageText}
                </ValidationErrorsItem>
            ))}
        </ValidationErrorsWrapper>
    );
});
