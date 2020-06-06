import styled from '@emotion/styled';
import {editFile} from 'actions/exercise-files';
import {CollapsiblePanel} from 'components/collapsible-panel';
import {exercises} from 'lib/exercises';
import React, {useCallback, useState} from 'react';
import {MonacoEditor} from 'components/monaco-editor';
import {useDispatch, useSelector} from 'react-redux';
import {getFinalExerciseFileContents} from 'selectors/exercise-files';
import {FileTreeView} from 'components/file-tree-view';

const ExerciseWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
`;

const EditorWrapper = styled.div`
    flex: 1 1 auto;
    position: relative;
    min-width: 1px;
`;

export function Exercise({exerciseNumber}: {exerciseNumber: number}) {
    const fileContents = useSelector(getFinalExerciseFileContents);
    const [selectedFilename, setSelectedFilename] = useState('index.ts');
    const dispatch = useDispatch();
    const onChange = useCallback((filename: string, content: string) => {
        dispatch(editFile({exercise: exerciseNumber, filename, content}));
    }, [dispatch, exerciseNumber]);
    return (
        <ExerciseWrapper>
            <CollapsiblePanel
                id='files'
                header='Files'
            >
                <FileTreeView
                    selectedFilename={selectedFilename}
                    fileTree={exercises[exerciseNumber].files}
                    onSelectFilename={setSelectedFilename}
                />
            </CollapsiblePanel>
            <EditorWrapper>
                <MonacoEditor
                    namespace={String(exerciseNumber)}
                    selectedFilename={selectedFilename}
                    values={fileContents[exerciseNumber]}
                    onChange={onChange}
                    theme='vs-light'
                    options={{
                        readOnly: Boolean(exercises[exerciseNumber].files[selectedFilename].readOnly),
                        minimap: {
                            enabled: false
                        }
                    }}
                />
            </EditorWrapper>
            <CollapsiblePanel
                id='exercise'
                header='Exercise'>
                123
            </CollapsiblePanel>
        </ExerciseWrapper>
    )
}
