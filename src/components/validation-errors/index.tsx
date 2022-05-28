import styled from '@emotion/styled';
import React from 'react';
import {ValidationError} from 'lib/validation-error';

const ValidationErrorsWrapper = styled.ol`
    padding: 0;
    margin: 5px 0 5px 40px;
    list-style: none;
    counter-reset: errors;
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
    return (
        <ValidationErrorsWrapper>
            {errors.map((error, index) => (
                <ValidationErrorsItem key={index} onClick={() => onClick(error)}>
                    {error.messageText}
                </ValidationErrorsItem>
            ))}
        </ValidationErrorsWrapper>
    );
});
