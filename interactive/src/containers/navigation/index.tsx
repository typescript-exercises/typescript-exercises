import styled from '@emotion/styled';
import React from 'react';

const Wrapper = styled.div`
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    background: #faf9f8;
    border-bottom: 1px solid #294E80;
    align-items: center;
    padding: 0 15px;
`;

const NavBar = styled.nav`
    flex: 1 1 auto;
    list-style-type: none;
`;

const NavBarItem = styled.li`
    display: inline-block;
    margin: 0;
    padding: 0;
    position: relative;
    line-height: 30px;
    &::after {
        content: '›';
        margin: 0 5px;
        opacity: 0.25;
    }
    &:last-of-type::after {
        display: none;
    }
`;

const SettingsBar = styled.div`
    font-weight: bold;
`;

export function Navigation() {
    return (
        <Wrapper>
            <NavBar>
                <NavBarItem>Start</NavBarItem>
                <NavBarItem>1</NavBarItem>
                <NavBarItem>2</NavBarItem>
                <NavBarItem>3</NavBarItem>
                <NavBarItem>4</NavBarItem>
                <NavBarItem>5</NavBarItem>
                <NavBarItem>6</NavBarItem>
                <NavBarItem>7</NavBarItem>
                <NavBarItem>8</NavBarItem>
                <NavBarItem>9</NavBarItem>
                <NavBarItem>10</NavBarItem>
                <NavBarItem>11</NavBarItem>
                <NavBarItem>12</NavBarItem>
                <NavBarItem>13</NavBarItem>
                <NavBarItem>14</NavBarItem>
                <NavBarItem>15</NavBarItem>
            </NavBar>
            <SettingsBar>
                Settings
            </SettingsBar>
        </Wrapper>
    );
}
