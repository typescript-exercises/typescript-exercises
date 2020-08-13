import {ReplaySubject} from 'rxjs';
import {exerciseStructures} from 'lib/exercise-structures';
import {localData} from 'lib/local-data';

export interface ExercisesProgress {
    currentExerciseNumber: number;
    lastCompletedExerciseNumber: number;
}

const initialState = {
    currentExerciseNumber: 1,
    lastCompletedExerciseNumber: 0
};

export const exercisesProgress = (() => {
    const localStorageKey = 'exercisesProgress';
    const subject = new ReplaySubject<ExercisesProgress>(1);

    let state = localData.get(localStorageKey, initialState);

    const saveToLocalStorage = () => localData.set(localStorageKey, state);

    subject.next(state);
    return {
        completeExercise() {
            state = {
                ...state,
                lastCompletedExerciseNumber: Math.max(state.lastCompletedExerciseNumber, state.currentExerciseNumber),
                currentExerciseNumber: Math.min(state.currentExerciseNumber + 1, Object.keys(exerciseStructures).length)
            };
            subject.next(state);
            saveToLocalStorage();
        },
        goToExercise(exerciseNumber: number) {
            state = {
                ...state,
                currentExerciseNumber: Math.min(
                    state.lastCompletedExerciseNumber + 1,
                    Object.keys(exerciseStructures).length,
                    exerciseNumber
                )
            };
            subject.next(state);
            saveToLocalStorage();
        },
        observable$: subject
    };
})();
