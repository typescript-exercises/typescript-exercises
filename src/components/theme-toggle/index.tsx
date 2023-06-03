import styled from '@emotion/styled';
import React, {useCallback} from 'react';
import {useAppTheme} from 'containers/app-theme-provider';
import {MoonLogo} from './icons/MoonLogo';
import {SunLogo} from './icons/SunLogo';

interface ToggleProps {
    isDark: boolean;
}

const Toggle = styled.div<ToggleProps>`
    width: 50px;
    max-height: 30px;
    padding: 5px;
    display: block;
    border-radius: 1000px;
    cursor: pointer;
    box-shadow: 0 5px 20px -10px #000000;
    transition: background-color 0.2s ease-in;
    background-color: #ddd;

    .toggle-inner {
        display: flex;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 1000px;
        transition: margin-left 0.2s ease-in, background-color 0.2s ease-in;
        margin-left: ${(props) => (props.isDark ? '30px' : '0')};
        background-color: #294e80;
    }
`;

export function ThemeToggle() {
    const {theme, setTheme} = useAppTheme();
    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, [setTheme]);

    return (
        <Toggle isDark={theme === 'dark'} id='toggle' onClick={toggleTheme}>
            <div className='toggle-inner'>{theme === 'dark' ? <SunLogo /> : <MoonLogo />} </div>
        </Toggle>
    );
}
