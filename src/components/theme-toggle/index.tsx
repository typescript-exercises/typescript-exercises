import styled from '@emotion/styled';
import React from 'react';
import {MoonLogo} from './icons/MoonLogo';
import {SunLogo} from './icons/SunLogo';

interface ToggleProps {
    isDark: boolean;
}

const Toggle = styled.div<ToggleProps>`
    width: 50px;
    max-height: 30px;
    display: flex;
    padding: 5px;
    background-color: #1a202c;
    display: block;
    border-radius: 1000px;
    cursor: pointer;
    box-shadow: 0px 5px 20px -10px #000000;
    transition: background-color 0.2s ease-in;
    background-color: #ddd;

    .toggle-inner {
        display: flex;
        align-items: center;
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 1000px;
        transition: margin-left 0.2s ease-in, background-color 0.2s ease-in;
        margin-left: ${(props) => (props.isDark ? '30px' : '0')};
        background-color: #294e80;
    }
`;

export function ThemeToggle({toggleTheme}: {toggleTheme: () => void}) {
    const [darkMode, setDarkMode] = React.useState(localStorage.getItem('theme') === 'dark');

    const click = () => {
        toggleTheme();
        setDarkMode((current) => !current);
        localStorage.setItem('theme', darkMode ? 'light' : 'dark');
    };

    return (
        <Toggle isDark={darkMode} id='toggle' onClick={() => click()}>
            <div className='toggle-inner'>{darkMode ? <SunLogo /> : <MoonLogo />} </div>
        </Toggle>
    );
}
