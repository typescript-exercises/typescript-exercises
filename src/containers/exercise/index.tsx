import styled from '@emotion/styled';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {CollapsiblePanel} from 'components/collapsible-panel';
import {FileTitle} from 'components/file-title';
import {FileTreeView} from 'components/file-tree-view';
import {load} from 'components/loading-container';
import {MonacoEditor} from 'components/monaco-editor';
import {ValidationErrors} from 'components/validation-errors';
import {exerciseStructures} from 'lib/exercise-structures';
import {FileTree} from 'lib/file-tree';
import {ValidationError} from 'lib/validation-error';
import {createExercise} from 'observables/exercise';
import {exercisesProgress} from 'observables/exercises-progress';
import {urlParams} from 'observables/url-params';
import {checkTypeScriptProject} from 'operators/check-type-script-project';

const lastExerciseNumber = Number(Object.keys(exerciseStructures).pop());

const ExerciseWrapper = styled.div`
    flex: 1 0 100%;
    align-self: stretch;
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
    margin: 20px 0 0;
`;

const ButtonsWrapper = styled.div`
    text-align: center;
    margin: 20px 0;
`;

const ExerciseButton = styled.button`
    font-size: 16px;
    text-align: center;
    & + & {
        margin-left: 10px;
    }
`;

function calculateModifiedFilenames(exerciseNumber: number, fileTree: FileTree) {
    const files = exerciseStructures[exerciseNumber];
    const result: Record<string, true> = {};
    for (const [filename, {content}] of Object.entries(fileTree)) {
        if (content !== files[filename].content) {
            result[filename] = true;
        }
    }
    return result;
}

export function Exercise({exerciseNumber}: {exerciseNumber: number}) {
    const exercise = useMemo(() => createExercise(exerciseNumber), [exerciseNumber]);
    const [position, setPosition] = useState(undefined as number | undefined);
    const [solutionsVisible, setSolutionsVisible] = useState(false);
    const validationErrors$ = useMemo(() => exercise.observable$.pipe(checkTypeScriptProject()), [exercise]);
    const [selectedFilename, setSelectedFilename] = useState('/index.ts');
    useEffect(() => {
        const subscription = urlParams.observable$.subscribe((params) => {
            setSelectedFilename(String(params.file));
        });
        return () => subscription.unsubscribe();
    }, [setSelectedFilename]);

    const goToFile = useCallback((file: string) => urlParams.extend({file}), []);

    const onErrorClick = useCallback(
        (error: ValidationError) => {
            if (!error.file) {
                return;
            }
            goToFile(error.file);
            setPosition(error.start);
        },
        [setPosition, goToFile]
    );
    const onChange = useCallback(
        (filename: string, content: string) => {
            exercise.update(filename, content);
        },
        [exercise]
    );
    const [showSolutions, hideSolutions] = useMemo(
        () => [() => setSolutionsVisible(true), () => setSolutionsVisible(false)],
        [setSolutionsVisible]
    );

    return load(exercise.observable$, (fileTree) => (
        <ExerciseWrapper>
            <CollapsiblePanel id='files' header='Files' orientation='vertical'>
                <FileTreeView
                    selectedFilename={selectedFilename}
                    fileTree={exerciseStructures[exerciseNumber]}
                    onSelectFilename={goToFile}
                    modifiedFilenames={calculateModifiedFilenames(exerciseNumber, fileTree)}
                    revertFile={exercise.revert}
                />
            </CollapsiblePanel>
            <MainAreaWrapper>
                <FileTitle filename={selectedFilename} readOnly={Boolean(fileTree[selectedFilename].readOnly)} />
                <EditorWrapper>
                    <MonacoEditor
                        namespace={String(exerciseNumber)}
                        selectedFilename={selectedFilename}
                        values={fileTree}
                        onChange={onChange}
                        theme='vs-light'
                        position={position}
                        onNavigate={() => null}
                        options={{
                            minimap: {
                                enabled: false
                            }
                        }}
                        showSolutions={solutionsVisible}
                        onSolutionsClose={hideSolutions}
                    />
                </EditorWrapper>
                {load(validationErrors$, (errors) => (
                    <CollapsiblePanel
                        id='exercise'
                        header={errors.length > 0 ? `Errors (${errors.length})` : 'Completed'}
                        orientation='horizontal'>
                        <ExercisePanelWrapper>
                            {errors.length > 0 && (
                                <>
                                    <ValidationErrors errors={errors} onClick={onErrorClick} />
                                    <ButtonsWrapper>
                                        {'I give up, '}
                                        <ExerciseButton onClick={showSolutions}>
                                            show a possible solution
                                        </ExerciseButton>{' '}
                                        &nbsp; or
                                        <ExerciseButton onClick={exercisesProgress.skipExercise}>skip</ExerciseButton>
                                    </ButtonsWrapper>
                                </>
                            )}
                            {errors.length === 0 && (
                                <CompletedExerciseWrapper>
                                    <CompletedExerciseLabel>
                                        {exerciseNumber === lastExerciseNumber ? (
                                            <>Congratulations! That was the last exercise.</>
                                        ) : (
                                            <>Good job! Exercise {exerciseNumber} is completed.</>
                                        )}
                                    </CompletedExerciseLabel>
                                    {exerciseNumber !== lastExerciseNumber && (
                                        <ButtonsWrapper>
                                            <ExerciseButton onClick={exercisesProgress.completeExercise}>
                                                Next exercise
                                            </ExerciseButton>
                                            <ExerciseButton onClick={showSolutions}>Compare my solution</ExerciseButton>
                                        </ButtonsWrapper>
                                    )}
                                </CompletedExerciseWrapper>
                            )}
                        </ExercisePanelWrapper>
                    </CollapsiblePanel>
                ))}
            </MainAreaWrapper>
        </ExerciseWrapper>
    ));
}
