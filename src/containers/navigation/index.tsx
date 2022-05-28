import styled from '@emotion/styled';
import React from 'react';
import {combineLatest} from 'rxjs';
import {load} from 'components/loading-container';
import {exerciseStructures} from 'lib/exercise-structures';
import {exercisesProgress} from 'observables/exercises-progress';
import {urlParams} from 'observables/url-params';

const Wrapper = styled.div`
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    background: #faf9f8;
    border-bottom: 1px solid #294e80;
    align-items: center;
    padding: 0 10px;
    user-select: none;
`;

const NavBar = styled.nav`
    flex: 1 1 auto;
    list-style-type: none;
`;

const NavBarLabel = styled.li`
    display: inline-block;
    font-weight: bold;
    margin-right: 20px;
    opacity: 0.75;
`;

const NavBarItem = styled.li<{completed: boolean; current: boolean}>`
    display: inline-block;
    margin: 0;
    padding: 0;
    position: relative;
    line-height: 30px;
    color: ${({completed}) => (completed ? 'inherit' : 'gray')};
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
    return (
        <Wrapper>
            <NavBar>
                {load(
                    combineLatest([exercisesProgress.observable$, urlParams.observable$]),
                    ([{completedExercises}, params]) => (
                        <>
                            <NavBarLabel>Exercises</NavBarLabel>
                            {Object.keys(exerciseStructures).map((exerciseNumber) => (
                                <NavBarItem
                                    completed={completedExercises[exerciseNumber]}
                                    current={Number(exerciseNumber) === Number(params.exercise)}
                                    onClick={() => exercisesProgress.goToExercise(Number(exerciseNumber))}
                                    key={exerciseNumber}>
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
