import {debounce} from 'debounce';
import {editor, Uri, typescript} from 'monaco-editor';
import React, {
    ForwardedRef,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from 'react';
import {decorateWithAutoResize} from 'components/auto-resizer';
import {DiffDialog} from 'components/monaco-editor/diff-dialog';
import {FileTree} from 'lib/file-tree';
import {revalidateModel} from './revalidateModel';

typescript.typescriptDefaults.setCompilerOptions({
    strict: true,
    target: typescript.ScriptTarget.ES2018,
    moduleResolution: typescript.ModuleResolutionKind.NodeJs,
    typeRoots: ['declarations']
});
typescript.typescriptDefaults.setEagerModelSync(true);

export interface MonacoEditorProps {
    width?: string | number;
    height?: string | number;
    theme?: string;
    options?: editor.IStandaloneEditorConstructionOptions;
    namespace: string;
    values: FileTree;
    selectedFilename: string;
    onChange: (filename: string, content: string) => void;
    showSolutions: boolean;
    onSolutionsClose: () => void;
    onNavigated?: (filename: string) => void;
}

const extensionsToLanguages: {[ext: string]: string} = {
    ts: 'typescript',
    json: 'json'
};

interface Models {
    [key: string]: editor.IModel;
}

export interface MonacoEditorRef {
    setFilenameAndPosition: (filename: string, position: number) => void;
}

export const MonacoEditor = decorateWithAutoResize(
    forwardRef(function MonacoEditor(
        {
            width,
            height,
            theme,
            options,
            namespace,
            values,
            selectedFilename,
            onChange,
            showSolutions,
            onSolutionsClose,
            onNavigated
        }: MonacoEditorProps,
        forwardedRef: ForwardedRef<MonacoEditorRef>
    ) {
        const lastUpdatesRef = useRef<{[filename: string]: string}>({});

        const lastValuesRef = useRef(values);
        lastValuesRef.current = values;

        const modelsRef = useRef<Models | undefined>();
        const solutionModelsRef = useRef<Models | undefined>();
        const isReadOnlyRef = useRef<Map<editor.IModel, boolean>>(new Map());

        const [selectedSolutionFilename, setSelectedSolutionFilename] = useState<string | undefined>();

        useEffect(() => {
            modelsRef.current = {};
            solutionModelsRef.current = {};
            isReadOnlyRef.current = new Map();

            for (const [filename, {content, solution, readOnly}] of Object.entries(lastValuesRef.current)) {
                lastUpdatesRef.current[filename] = content;
                const language = extensionsToLanguages[filename.split('.').pop()!];
                const model = editor.createModel(content, language, Uri.file(`${namespace}${filename}`));
                modelsRef.current[filename] = model;
                isReadOnlyRef.current.set(model, Boolean(readOnly));
                if (solution !== undefined) {
                    solutionModelsRef.current[filename] = editor.createModel(
                        solution,
                        language,
                        Uri.file(`${namespace}/solutions${filename.replace(/\/([^/]+)$/, '/solution.$1')}`)
                    );
                }
            }

            setSelectedSolutionFilename(
                solutionModelsRef.current ? Object.keys(solutionModelsRef.current)[0] : undefined
            );

            return () => {
                for (const model of Object.values(modelsRef.current!).concat(
                    Object.values(solutionModelsRef.current!)
                )) {
                    model.dispose();
                }
            };
        }, [namespace]);

        useEffect(() => {
            if (!modelsRef.current) {
                return;
            }

            for (const [filename, value] of Object.entries(values)) {
                if (value.content !== lastUpdatesRef.current[filename]) {
                    lastUpdatesRef.current[filename] = value.content;
                    modelsRef.current[filename].setValue(value.content);
                }
            }
        }, [values]);

        useEffect(() => {
            if (!modelsRef.current) {
                return;
            }

            const disposables = Object.entries(modelsRef.current).map(([filename, model]) =>
                model.onDidChangeContent(
                    debounce(() => {
                        const newValue = model.getValue();
                        lastUpdatesRef.current[filename] = newValue;
                        onChange(filename, newValue);
                    }, 200)
                )
            );
            return () => disposables.forEach((d) => d.dispose());
        }, [onChange]);

        const divContainerRef = useRef<HTMLDivElement | null>(null);
        const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | undefined>();
        const selectedFilenameRef = useRef(selectedFilename);
        selectedFilenameRef.current = selectedFilename;
        const optionsRef = useRef(options);
        optionsRef.current = options;
        useEffect(() => {
            if (editorInstanceRef.current) {
                return;
            }
            if (!divContainerRef.current || !isReadOnlyRef.current || !modelsRef.current) {
                return;
            }

            const model = modelsRef.current[selectedFilenameRef.current];

            Promise.resolve().then(() => {
                editorInstanceRef.current = editor.create(divContainerRef.current!, {
                    ...optionsRef.current,
                    model: model,
                    readOnly: Boolean(isReadOnlyRef.current.get(model)),
                    renderValidationDecorations: 'on'
                });
            });

            revalidateModel(model);
            return () => {
                editorInstanceRef.current?.dispose();
            };
        }, []);

        const viewStatesRef = useRef<Map<editor.IModel, editor.ICodeEditorViewState>>(new Map());
        const switchToModel = useCallback((model: editor.IModel) => {
            const editorInstance = editorInstanceRef.current;
            if (!editorInstance || !isReadOnlyRef.current) {
                return;
            }
            const currentlySelectedModel = editorInstance.getModel();
            if (currentlySelectedModel !== model) {
                if (currentlySelectedModel) {
                    viewStatesRef.current.set(currentlySelectedModel, editorInstance.saveViewState()!);
                }
                editorInstance.setModel(model);
                editorInstance.updateOptions({
                    readOnly: Boolean(isReadOnlyRef.current.get(model))
                });
                const viewState = viewStatesRef.current.get(model);
                if (viewState) {
                    editorInstance.restoreViewState(viewState);
                }
                revalidateModel(model);
            }
        }, []);

        useEffect(() => {
            const editorInstance = editorInstanceRef.current;
            if (!editorInstance || !modelsRef.current) {
                return;
            }
            switchToModel(modelsRef.current[selectedFilename]);
        }, [selectedFilename, switchToModel]);

        useEffect(() => {
            if (options && editorInstanceRef.current) {
                editorInstanceRef.current?.updateOptions(options);
            }
        }, [options]);

        useImperativeHandle(forwardedRef, () => ({
            setFilenameAndPosition: (filename: string, pos: number) => {
                const editorInstance = editorInstanceRef.current;
                if (!editorInstance || !modelsRef.current) {
                    return;
                }
                const model = modelsRef.current[filename];
                switchToModel(model);
                const position = model.getPositionAt(pos);
                editorInstance.setPosition(position);
                editorInstance.revealLine(position.lineNumber);
                editorInstance.focus();
            }
        }));

        useEffect(() => {
            if (!onNavigated || !editorInstanceRef.current) {
                return;
            }
            const disposable = editor.registerEditorOpener({
                openCodeEditor(_source, resource, selectionOrPosition) {
                    if (!editorInstanceRef.current || !modelsRef.current) {
                        return false;
                    }
                    for (const [filename, model] of Object.entries(modelsRef.current)) {
                        if (model.uri.toString() === resource.toString()) {
                            switchToModel(model);
                            if (selectionOrPosition) {
                                let position;
                                if ('startLineNumber' in selectionOrPosition) {
                                    position = {
                                        lineNumber: selectionOrPosition.startLineNumber,
                                        column: selectionOrPosition.startColumn
                                    };
                                } else {
                                    position = selectionOrPosition;
                                }
                                editorInstanceRef.current.setPosition(position);
                                editorInstanceRef.current.revealLine(position.lineNumber);
                            }
                            editorInstanceRef.current.focus();
                            onNavigated(filename);
                            return true;
                        }
                    }
                    return false;
                }
            });
            return () => disposable.dispose();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [onNavigated, switchToModel, editorInstanceRef.current]);

        useLayoutEffect(() => {
            editorInstanceRef.current?.layout();
        }, [width, height]);

        useEffect(() => {
            editor.setTheme(theme || 'vs');
        }, [theme]);

        return (
            <>
                <div ref={divContainerRef} style={{width: width, height: height}} />
                {showSolutions && modelsRef.current && solutionModelsRef.current && selectedSolutionFilename && (
                    <DiffDialog
                        selectedFilename={selectedSolutionFilename}
                        original={solutionModelsRef.current[selectedSolutionFilename]}
                        modified={modelsRef.current[selectedSolutionFilename]}
                        onClose={onSolutionsClose}
                        onSelectFile={setSelectedSolutionFilename}
                        filenames={Object.keys(solutionModelsRef.current)}
                    />
                )}
            </>
        );
    })
);
