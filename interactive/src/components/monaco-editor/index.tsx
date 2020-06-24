import styled from '@emotion/styled';
import debounce from 'debounce';
import React, {useEffect, useRef, useState} from 'react';
import {OriginalMonacoEditor, OriginalMonacoEditorProps} from 'components/monaco-editor/original-monaco-editor';

const MonacoEditorWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
`;

export function MonacoEditor(props: OriginalMonacoEditorProps) {
    const [size, setSize] = useState({width: '100%', height: '100%'});
    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const updateSize = debounce(() => {
            setSize((size) => {
                if (!wrapperRef.current) {
                    return size;
                }
                const newWidth = `${wrapperRef.current.offsetWidth}px`;
                const newHeight = `${wrapperRef.current.offsetHeight}px`;
                if (size.width === newWidth && size.height === newHeight) {
                    return size;
                }
                return {
                    width: newWidth,
                    height: newHeight
                };
            });
        }, 100);
        window.addEventListener('resize', updateSize, {passive: true});
        const interval = setInterval(updateSize, 500);
        return () => {
            window.removeEventListener('resize', updateSize);
            clearInterval(interval);
        };
    }, [wrapperRef]);
    return (
        <MonacoEditorWrapper ref={wrapperRef}>
            <OriginalMonacoEditor {...props} {...size} />
        </MonacoEditorWrapper>
    );
}
