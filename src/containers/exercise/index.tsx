import {useTheme} from '@emotion/react';
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

const CompletedExerciseLabel = styled.div<{color: string}>`
    margin: 20px 0 0;
    color: ${(props) => props.color};
`;

const ButtonsWrapper = styled.div<{color: string; backgroundColor: string}>`
    text-align: center;
    margin: 20px 0;
    color: ${(props) => props.color};

    button {
        border: 1px solid ${(props) => props.color};
        color: ${(props) => props.color};
        border-radius: 4px;
        font-size: 16px;
        text-align: center;
        margin: 0 10px;
        color: ${(props) => props.color};
        background-color: ${(props) => props.backgroundColor};
        cursor: pointer;

        :hover {
            filter: ${(props) => (props.backgroundColor === '#1e1e1e' ? 'brightness(1.3)' : 'brightness(0.9)')};
        }
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
    const theme = useTheme();

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
                        theme={theme.style === 'light' ? 'vs' : 'vs-dark'}
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
                                    <ButtonsWrapper color={theme.color} backgroundColor={theme.background}>
                                        {'I give up, '}
                                        <button onClick={showSolutions}>show a possible solution</button> or
                                        <button onClick={exercisesProgress.skipExercise}>skip</button>
                                    </ButtonsWrapper>
                                </>
                            )}
                            {errors.length === 0 && (
                                <CompletedExerciseWrapper>
                                    <CompletedExerciseLabel color={theme.color}>
                                        {exerciseNumber === lastExerciseNumber ? (
                                            <>Congratulations! That was the last exercise.</>
                                        ) : (
                                            <>Good job! Exercise {exerciseNumber} is completed.</>
                                        )}
                                    </CompletedExerciseLabel>
                                    {exerciseNumber !== lastExerciseNumber && (
                                        <ButtonsWrapper color={theme.color} backgroundColor={theme.background}>
                                            <button onClick={exercisesProgress.completeExercise}>Next exercise</button>
                                            <button onClick={showSolutions}>Compare my solution</button>
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
