import styled from '@emotion/styled';
import {OriginalMonacoEditor, OriginalMonacoEditorProps} from 'components/monaco-editor/original-monaco-editor';
import React, {useEffect, useRef, useState} from 'react';
import debounce from 'debounce';

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
            if (wrapperRef.current) {
                setSize({
                    width: `${wrapperRef.current.offsetWidth}px`,
                    height: `${wrapperRef.current.offsetHeight}px`
                });
            }
        }, 100);
        window.addEventListener('resize', updateSize, {passive: true});
        return () => window.removeEventListener('resize', updateSize);
    }, [wrapperRef]);
    return (
        <MonacoEditorWrapper ref={wrapperRef}>
            <OriginalMonacoEditor {...props} width={size.width} height={size.height} />
        </MonacoEditorWrapper>
    );
}
