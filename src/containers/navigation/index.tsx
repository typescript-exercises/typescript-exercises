import styled from '@emotion/styled';
import React from 'react';
import {load} from 'components/loading-container';
import {exerciseStructures} from 'lib/exercise-structures';
import {exercisesProgress} from 'observables/exercises-progress';

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

const NavBarItem = styled.li<{selectable: boolean; current: boolean}>`
    display: inline-block;
    margin: 0;
    padding: 0;
    position: relative;
    line-height: 30px;
    color: ${({selectable}) => (selectable ? 'inherit' : 'gray')};
    // pointer-events: ${({selectable, current}) => (selectable && !current ? 'all' : 'none')};
    cursor: ${({selectable, current}) => (selectable && !current ? 'pointer' : 'inherit')};
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
                {load(exercisesProgress.observable$, ({currentExerciseNumber, lastCompletedExerciseNumber}) => (
                    <>
                        <NavBarLabel>Exercises</NavBarLabel>
                        {Object.keys(exerciseStructures).map((exerciseNumber) => (
                            <NavBarItem
                                selectable={Number(exerciseNumber) <= lastCompletedExerciseNumber + 1}
                                current={Number(exerciseNumber) === currentExerciseNumber}
                                onClick={() => exercisesProgress.goToExercise(Number(exerciseNumber))}
                                key={exerciseNumber}>
                                {exerciseNumber}
                            </NavBarItem>
                        ))}
                    </>
                ))}
            </NavBar>
        </Wrapper>
    );
}
