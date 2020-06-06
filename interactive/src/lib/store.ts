import {exercise} from 'reducers/exercise';
import {exerciseFiles} from 'reducers/exercise-files';
import {ui} from 'reducers/ui';
import {createStore, combineReducers, applyMiddleware, Store, CombinedState} from 'redux';
import thunk from 'redux-thunk';

export const store = createStore(
    combineReducers({
        exercise,
        exerciseFiles,
        ui
    }),
    applyMiddleware(
        thunk
    )
);

export type State = typeof store extends Store<CombinedState<infer R>> ? R : never;
