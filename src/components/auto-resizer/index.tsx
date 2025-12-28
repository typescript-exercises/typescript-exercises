import styled from '@emotion/styled';
import debounce from 'debounce';
import React, {ForwardedRef, forwardRef, useEffect, useRef, useState} from 'react';

type PropsWithSize<T, TRef> = T & {
    width?: string | number;
    height?: string | number;
    ref?: ForwardedRef<TRef>;
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
`;

export function decorateWithAutoResize<T, TRef>(Component: React.ComponentType<PropsWithSize<T, TRef>>) {
    return forwardRef((props: T, ref: ForwardedRef<TRef>) => {
        const [size, setSize] = useState({width: '100%', height: '100%'});
        const wrapperRef = useRef<HTMLDivElement>(null);
        const isMountedRef = useRef(false);
        useEffect(() => {
            isMountedRef.current = true;
            const updateSize = debounce(() => {
                if (!isMountedRef.current) {
                    return;
                }
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
                isMountedRef.current = false;
                window.removeEventListener('resize', updateSize);
                clearInterval(interval);
            };
        }, [wrapperRef]);
        return (
            <Wrapper ref={wrapperRef}>
                <Component ref={ref} {...props} {...size} />
            </Wrapper>
        );
    });
}
