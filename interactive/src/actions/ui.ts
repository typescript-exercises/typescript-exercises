import {createAction} from 'actions/common/create-action';

export const collapsePanel = createAction<{panel: string}>('COLLAPSE_PANEL');
export const expandPanel = createAction<{panel: string}>('EXPAND_PANEL');
