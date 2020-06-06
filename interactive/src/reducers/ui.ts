import {collapsePanel, expandPanel} from 'actions/ui';
import {reducerWithInitialState} from 'typescript-fsa-reducers';

export const ui = reducerWithInitialState({
    panelStates: {} as {[key: string]: {collapsed: boolean}}
})
    .case(collapsePanel, (state, {panel}) => ({
        ...state,
        panelStates: {
            ...state.panelStates,
            [panel]: {
                ...state.panelStates[panel],
                collapsed: true
            }
        }
    }))
    .case(expandPanel, (state, {panel}) => ({
        ...state,
        panelStates: {
            ...state.panelStates,
            [panel]: {
                ...state.panelStates[panel],
                collapsed: false
            }
        }
    }));
