import {createAction} from 'actions/common/create-action';

export const editFile = createAction<{exercise: number, filename: string, content: string}>('EDIT_FILE');
