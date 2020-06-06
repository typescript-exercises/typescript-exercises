import {State} from 'lib/store';
import {createSelector} from 'reselect';
import {exercises} from 'lib/exercises';

export function getExerciseFiles(state: State) {
    return state.exerciseFiles;
}

export interface FileContents {
    [filename: string]: string;
}

export interface FileContentsByExercises {
    [exercise: string]: FileContents;
}

export const getFinalExerciseFileContents = createSelector(
    [getExerciseFiles],
    ({files}) => {
        const result: FileContentsByExercises = {};
        for (let i = 0; i < exercises.length; i++) {
            const exercise = exercises[i].files;
            const fileContents: FileContents = {};
            for (const filename of Object.keys(exercise)) {
                let currentContent = files?.[i]?.[filename];
                fileContents[filename] = currentContent === undefined ?
                    exercises[i].files[filename].content : currentContent;
            }
            result[i] = fileContents;
        }
        return result;
    }
);
