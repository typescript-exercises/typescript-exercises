import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import React, {useEffect} from 'react';

const DialogBackground = styled.div`
    display: block;
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
`;

const DialogWrapper = styled.div<{backgroundColor: string}>`
    position: absolute;
    top: 50px;
    right: 50px;
    bottom: 50px;
    left: 50px;
    padding: 40px 10px 10px;
    background: ${(props) => props.backgroundColor}
    border: 1px solid #dddddd;
    border-radius: 2px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const stopEventPropagation = (e: React.UIEvent) => e.stopPropagation();

export function Dialog({children, onClose}: {children: React.ReactNode; onClose: () => void}) {
    const theme = useTheme();

    useEffect(() => {
        const handleDialogClose = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleDialogClose);

        return () => {
            window.removeEventListener('keydown', handleDialogClose);
        };
    }, [onClose]);

    return (
        <DialogBackground onClick={onClose}>
            <DialogWrapper onClick={stopEventPropagation} backgroundColor={theme.background}>
                <CloseButton onClick={onClose}>✖</CloseButton>
                {children}
            </DialogWrapper>
        </DialogBackground>
    );
}
