import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import {combineLatest} from 'rxjs';
import {load} from 'components/loading-container';
import {exerciseStructures} from 'lib/exercise-structures';
import {exercisesProgress} from 'observables/exercises-progress';
import {urlParams} from 'observables/url-params';

const Wrapper = styled.div<{mode: 'light' | 'dark'}>`
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    background: ${(props) => (props.mode === 'light' ? '#faf9f8' : '#171717')};
    border-bottom: 1px solid ${(props) => (props.mode === 'light' ? '#294e80' : '#ddd')};
    align-items: center;
    padding: 0 10px;
    user-select: none;
`;

const NavBar = styled.nav`
    flex: 1 1 auto;
    list-style-type: none;
`;

const NavBarLabel = styled.li<{color: string}>`
    display: inline-block;
    font-weight: bold;
    margin-right: 20px;
    opacity: 0.75;
    color: ${(props) => props.color};
`;

const NavBarItem = styled.li<{completed: boolean; current: boolean; mode: 'light' | 'dark'}>`
    display: inline-block;
    margin: 0;
    padding: 0;
    position: relative;
    line-height: 30px;
    color: ${({completed, mode}) => (completed ? (mode === 'light' ? 'inherit' : 'white') : 'gray')};
    cursor: pointer;
    font-weight: ${({current}) => (current ? 'bold' : 'normal')};
    &::after {
        content: '·';
        margin: 0 5px;
        opacity: 0.25;
    }
    &:last-of-type::after {
        display: none;
    }
`;

export function Navigation() {
    const theme = useTheme();
    return (
        <Wrapper mode={theme.style}>
            <NavBar>
                {load(
                    combineLatest([exercisesProgress.observable$, urlParams.observable$]),
                    ([{completedExercises}, params]) => (
                        <>
                            <NavBarLabel color={theme.color}>Exercises</NavBarLabel>
                            {Object.keys(exerciseStructures).map((exerciseNumber) => (
                                <NavBarItem
                                    completed={completedExercises[exerciseNumber]}
                                    current={Number(exerciseNumber) === Number(params.exercise)}
                                    onClick={() => exercisesProgress.goToExercise(Number(exerciseNumber))}
                                    key={exerciseNumber}
                                    mode={theme.style}>
                                    {exerciseNumber}
                                </NavBarItem>
                            ))}
                        </>
                    )
                )}
            </NavBar>
        </Wrapper>
    );
}
