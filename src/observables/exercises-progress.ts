import {ReplaySubject} from 'rxjs';
import {exerciseStructures} from 'lib/exercise-structures';
import {localData} from 'lib/local-data';
import {migrate} from 'observables/migrations/2020-09-26';
import {urlParams} from 'observables/url-params';

export interface ExercisesProgress {
    completedExercises: Record<string, boolean>;
}

const initialState: ExercisesProgress = {
    completedExercises: {}
};

function switchToExercise(exerciseNumber: number) {
    urlParams.extend({exercise: String(exerciseNumber), file: '/index.ts'});
}

export const exercisesProgress = (() => {
    migrate();

    const localStorageKey = 'exercisesProgress';
    const subject = new ReplaySubject<ExercisesProgress>(1);

    const exercisesCount = Object.keys(exerciseStructures).length;

    let state = localData.get(localStorageKey, initialState);

    const saveToLocalStorage = () => localData.set(localStorageKey, state);

    let currentExerciseNumber = 1;

    if (!urlParams.getCurrentRawParams().exercise) {
        for (currentExerciseNumber = 1; currentExerciseNumber <= exercisesCount; currentExerciseNumber++) {
            if (!state.completedExercises[currentExerciseNumber]) {
                break;
            }
        }

        if (currentExerciseNumber !== 1) {
            switchToExercise(currentExerciseNumber);
        }
    }

    urlParams.observable$.subscribe((params) => {
        currentExerciseNumber = Number(params.exercise || '1');
    });

    subject.next(state);

    return {
        completeExercise() {
            state = {...state, completedExercises: {...state.completedExercises, [currentExerciseNumber]: true}};
            saveToLocalStorage();
            currentExerciseNumber = Math.min(currentExerciseNumber + 1, exercisesCount);
            switchToExercise(currentExerciseNumber);
            subject.next(state);
        },
        skipExercise() {
            currentExerciseNumber = Math.min(currentExerciseNumber + 1, exercisesCount);
            switchToExercise(currentExerciseNumber);
        },
        goToExercise(exerciseNumber: number) {
            switchToExercise(exerciseNumber);
        },
        observable$: subject
    };
})();
