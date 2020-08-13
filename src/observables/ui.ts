import {ReplaySubject} from 'rxjs';

export const ui = (() => {
    const initialState = {
        panels: {
            exercise: {
                collapsed: false
            },
            files: {
                collapsed: false
            },
            solutionFiles: {
                collapsed: false
            }
        } as {[panel: string]: {collapsed: boolean}}
    };

    type State = typeof initialState;

    const subject = new ReplaySubject<State>(1);

    let state = initialState;

    subject.next(state);

    function updateState(newState: State) {
        state = newState;
        subject.next(newState);
    }

    return {
        observable$: subject,
        expandPanel: (panelName: string) =>
            updateState({
                ...state,
                panels: {
                    ...state.panels,
                    [panelName]: {
                        ...state.panels[panelName],
                        collapsed: false
                    }
                }
            }),
        collapsePanel: (panelName: string) =>
            updateState({
                ...state,
                panels: {
                    ...state.panels,
                    [panelName]: {
                        ...state.panels[panelName],
                        collapsed: true
                    }
                }
            })
    };
})();
