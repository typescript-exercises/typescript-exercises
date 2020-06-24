import styled from '@emotion/styled';
import React, {useCallback, useMemo, useState} from 'react';
import {CollapsiblePanel} from 'components/collapsible-panel';
import {FileTreeView} from 'components/file-tree-view';
import {load} from 'components/loading-container';
import {MonacoEditor} from 'components/monaco-editor';
import {ValidationErrors} from 'components/validation-errors';
import {exerciseStructures} from 'lib/exercise-structures';
import {ValidationError} from 'lib/validation-error';
import {createExercise} from 'observables/exercise';
import {exercisesProgress} from 'observables/exercises-progress';
import {checkTypeScriptProject} from 'operators/check-type-script-project';

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

const ExercisePanelWrapper = styled.div`
    padding: 5px 10px;
    overflow: auto;
    height: 120px;
    box-sizing: border-box;
`;

const MainAreaWrapper = styled.div`
    min-width: 1px;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
`;

const CompletedExerciseWrapper = styled.div`
    text-align: center;
`;

const CompletedExerciseLabel = styled.div`
    margin: 20px 0 15px;
`;

const CompletedExerciseButton = styled.button`
    font-size: 18px;
`;

export function Exercise({exerciseNumber}: {exerciseNumber: number}) {
    const exercise = useMemo(() => createExercise(exerciseNumber), [exerciseNumber]);
    const [position, setPosition] = useState(undefined as number | undefined);
    const validationErrors$ = useMemo(() => exercise.observable$.pipe(checkTypeScriptProject()), [exercise]);
    const [selectedFilename, setSelectedFilename] = useState('/index.ts');
    const onErrorClick = useCallback(
        (error: ValidationError) => {
            setSelectedFilename(error.file);
            setPosition(error.start);
        },
        [setPosition, setSelectedFilename]
    );
    const onChange = useCallback(
        (filename: string, content: string) => {
            exercise.update(filename, content);
        },
        [exercise]
    );

    return load(exercise.observable$, (fileContents) => (
        <ExerciseWrapper>
            <CollapsiblePanel id='files' header='Files' orientation='vertical'>
                <FileTreeView
                    selectedFilename={selectedFilename}
                    fileTree={exerciseStructures[exerciseNumber].files}
                    onSelectFilename={setSelectedFilename}
                />
            </CollapsiblePanel>
            <MainAreaWrapper>
                <EditorWrapper>
                    <MonacoEditor
                        namespace={String(exerciseNumber)}
                        selectedFilename={selectedFilename}
                        values={fileContents}
                        onChange={onChange}
                        onSwitchFile={setSelectedFilename}
                        theme='vs-light'
                        position={position}
                        options={{
                            minimap: {
                                enabled: false
                            }
                        }}
                    />
                </EditorWrapper>
                {load(validationErrors$, (errors) => (
                    <CollapsiblePanel
                        id='exercise'
                        header={errors.length > 0 ? `Errors (${errors.length})` : 'Completed'}
                        orientation='horizontal'>
                        <ExercisePanelWrapper>
                            {errors.length > 0 && <ValidationErrors errors={errors} onClick={onErrorClick} />}
                            {errors.length === 0 && (
                                <CompletedExerciseWrapper>
                                    <CompletedExerciseLabel>
                                        Good job! Exercise {exerciseNumber} is completed.
                                    </CompletedExerciseLabel>
                                    <CompletedExerciseButton onClick={exercisesProgress.completeExercise}>
                                        Next exercise
                                    </CompletedExerciseButton>
                                </CompletedExerciseWrapper>
                            )}
                        </ExercisePanelWrapper>
                    </CollapsiblePanel>
                ))}
            </MainAreaWrapper>
        </ExerciseWrapper>
    ));
}
