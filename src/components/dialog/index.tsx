import styled from '@emotion/styled';
import React from 'react';

const DialogBackground = styled.div`
    display: block;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
`;

const DialogWrapper = styled.div`
    position: absolute;
    top: 50px;
    right: 50px;
    bottom: 50px;
    left: 50px;
    padding: 40px 10px 10px;
    background: white;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
`;

const stopEventPropagation = (e: React.UIEvent) => e.stopPropagation();

export function Dialog({children, onClose}: {children: React.ReactNode; onClose: () => void}) {
    return (
        <DialogBackground onClick={onClose}>
            <DialogWrapper onClick={stopEventPropagation}>
                <CloseButton onClick={onClose}>Close</CloseButton>
                {children}
            </DialogWrapper>
        </DialogBackground>
    );
}
