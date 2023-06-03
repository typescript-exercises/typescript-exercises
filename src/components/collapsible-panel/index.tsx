import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import React, {useMemo} from 'react';
import {load} from 'components/loading-container';
import {ui} from 'observables/ui';

const width = 200;
const height = 150;

type Orientation = 'vertical' | 'horizontal';

const Header = styled.div<{collapsed: boolean; orientation: Orientation}>`
    position: absolute;
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 0;
    height: 30px;
    min-width: 100%;
    transform: rotate(0) translateX(0);
    transform-origin: top left;
    cursor: pointer;
    border-bottom: 1px #ddd solid;
    ${({collapsed, orientation}) =>
        collapsed && orientation === 'vertical'
            ? `
                transform: rotate(-90deg) translateX(-100%);
                button {
                    display: none;
                }
            `
            : ''}
`;

const HeaderLabel = styled.div<{color: string}>`
    flex: 1 1 auto;
    font-weight: bold;
    line-height: 30px;
    padding: 0 10px;
    color: ${(props) => props.color};
`;

const Content = styled.div<{collapsed: boolean; orientation: Orientation}>`
    flex: 1 1 auto;
    padding: 30px 0 0;
    transform: scaleX(100%) scaleY(100%);
    transform-origin: ${({orientation}) => (orientation === 'vertical' ? 'left center' : 'center bottom')};
    opacity: 1;
    transition: transform 0.2s linear, opacity 0.2s linear;
    ${({collapsed, orientation}) =>
        collapsed
            ? `
                position: absolute;
                transform: ${orientation === 'vertical' ? 'scaleX' : 'scaleY'}(0);
                opacity: 0;
            `
            : ''}
`;

const CollapseButton = styled.button`
    display: block;
    float: right;
    border: none;
    padding: 5px 10px;
    background: transparent;
    font-weight: bold;
    cursor: pointer;
    &::before {
        content: '_';
    }
`;

const Wrapper = styled.div<{collapsed: boolean; orientation: Orientation; background: string}>`
    position: relative;
    background-color: ${(props) => props.background};
    display: flex;
    flex-direction: column;
    flex: 0 0 ${({collapsed, orientation}) => (collapsed ? '30px' : `${orientation === 'vertical' ? width : height}px`)};
    ${({orientation}) => (orientation === 'vertical' ? 'border-right' : 'border-bottom')}: 1px #ddd solid;
    &:last-of-type {
        ${({orientation}) => (orientation === 'vertical' ? 'border-right' : 'border-bottom')}: none;
        ${({orientation}) => (orientation === 'vertical' ? 'border-left' : 'border-top')}: 1px #ddd solid;
    }
    transition: flex-basis 0.2s linear;
`;

export function CollapsiblePanel({
    id,
    header,
    orientation,
    children
}: {
    id: string;
    header: React.ReactNode | string;
    orientation: Orientation;
    children: React.ReactNode;
}) {
    const [collapse, expand] = useMemo(() => [() => ui.collapsePanel(id), () => ui.expandPanel(id)], [id]);
    const theme = useTheme();

    return load(ui.observable$, ({panels}) => (
        <Wrapper collapsed={panels[id].collapsed} orientation={orientation} background={theme.background}>
            <Content collapsed={panels[id].collapsed} orientation={orientation}>
                {children}
            </Content>
            <Header
                collapsed={panels[id].collapsed}
                orientation={orientation}
                onClick={panels[id].collapsed ? expand : collapse}>
                <HeaderLabel color={theme.color}>{header}</HeaderLabel>
                <CollapseButton />
            </Header>
        </Wrapper>
    ));
}
