import {State} from 'lib/store';

export function getUiPanelStates(state: State) {
    return state.ui.panelStates;
}
