import {editFile} from 'actions/exercise-files';
import {reducerWithInitialState} from 'typescript-fsa-reducers';

export const exerciseFiles = reducerWithInitialState({
    files: {} as {[exercise: string]: {
        [filename: string]: string
    }}
})
    .case(editFile, (state, {exercise, filename, content}) => ({
        ...state,
        files: {
            ...state.files,
            [exercise]: {
                ...state.files[exercise],
                [filename]: content
            }
        }
    }));
