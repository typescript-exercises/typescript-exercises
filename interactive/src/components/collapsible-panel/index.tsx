import styled from '@emotion/styled';
import {collapsePanel, expandPanel} from 'actions/ui';
import React, {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUiPanelStates} from 'selectors/ui';

const width = 200;

const Header = styled.div<{collapsed: boolean}>`
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
    background: #f6f6f6;
    ${({collapsed}) => collapsed ? `
        transform: rotate(-90deg) translateX(-100%);
        button {
            display: none;
        }
    ` : ''}
`;

const HeaderLabel = styled.div`
    flex: 1 1 auto;
    font-weight: bold;
    opacity: 0.75;
    padding: 5px 10px;
`;

const Content = styled.div<{collapsed: boolean}>`
    flex: 1 1 auto;
    padding: 30px 0 5px;
    transform: scaleX(100%);
    opacity: 1;
    transition: transform 0.2s linear, opacity 0.2s linear;
    ${({collapsed}) => collapsed ? `
        position: absolute;
        transform: scaleX(0);
        opacity: 0;
    ` : ''}
`;

const CollapseButton = styled.button`
    display: block;
    float: right;
    border: none;
    padding: 5px 10px;
    background: #f6f6f6;
    font-weight: bold;
    cursor: pointer;
    &::before {
        content: '_';
    }
`;

const Wrapper = styled.div<{collapsed: boolean}>`
    position: relative;
    background-color: ${({collapsed}) => collapsed ? '#f6f6f6' : `white`};
    display: flex;
    flex-direction: column;
    flex: 0 0 ${({collapsed}) => collapsed ? '30px' : `${width}px`};
    border-right: 1px #aaa solid;
    &:last-of-type {
        border-right: none;
        border-left: 1px #aaa solid;
    }
    transition: flex-basis 0.2s linear, background-color 0.2s linear;
`;

export function CollapsiblePanel({id, header, children}: {
    id: string,
    header: React.ReactNode | string,
    children: React.ReactNode
}) {
    const panelStates = useSelector(getUiPanelStates);
    const dispatch = useDispatch();
    const [collapse, expand] = useMemo(() => [
        () => dispatch(collapsePanel({panel: id})),
        () => dispatch(expandPanel({panel: id}))
    ], [dispatch, id]);
    const panelState = panelStates[id] || {collapsed: false};
    return (
        <Wrapper collapsed={panelState.collapsed}>
            <Header collapsed={panelState.collapsed} onClick={panelState.collapsed ? expand : collapse}>
                <HeaderLabel>
                    {header}
                </HeaderLabel>
                <CollapseButton />
            </Header>
            <Content collapsed={panelState.collapsed}>{children}</Content>
        </Wrapper>
    );
}
