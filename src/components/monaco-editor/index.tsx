import {debounce} from 'debounce';
import {editor, languages, Uri} from 'monaco-editor';
import React from 'react';
import {decorateWithAutoResize} from 'components/auto-resizer';
import {DiffDialog} from 'components/monaco-editor/diff-dialog';
import {FileTree} from 'lib/file-tree';
import {revalidateModel} from './revalidate-model';

languages.typescript.typescriptDefaults.setCompilerOptions({
    strict: true,
    target: languages.typescript.ScriptTarget.ES2018,
    moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
    typeRoots: ['declarations']
});

export interface MonacoEditorProps {
    width?: string | number;
    height?: string | number;
    theme?: string;
    options?: editor.IStandaloneEditorConstructionOptions;
    namespace: string;
    values: FileTree;
    selectedFilename: string;
    onChange: (filename: string, content: string) => void;
    onNavigate: (filename: string) => void;
    position: number | undefined;
    showSolutions: boolean;
    onSolutionsClose: () => void;
}

const extensionsToLanguages: {[ext: string]: string} = {
    ts: 'typescript',
    json: 'json'
};

interface Models {
    [key: string]: editor.IModel;
}

interface MonacoEditorState {
    solutionsSelectedFilename?: string;
    initialized?: boolean;
}

export const MonacoEditor = decorateWithAutoResize(
    class extends React.Component<MonacoEditorProps, MonacoEditorState> {
        protected instance: editor.IStandaloneCodeEditor | null = null;
        protected instanceDiv: HTMLElement | null = null;
        protected models: Models = {};
        protected solutionsModels: Models = {};
        protected solutionsFilenames: string[] = [];
        protected viewStates: {[filename: string]: editor.ICodeEditorViewState} = {};
        protected lastUpdates: {[filename: string]: string} = {};

        constructor(props: MonacoEditorProps) {
            super(props);
            this.state = {};
            editor.setTheme(props.theme || 'vs');
        }

        public componentDidMount() {
            const {props} = this;

            for (const [filename, {content, solution}] of Object.entries(props.values)) {
                this.lastUpdates[filename] = content;
                const language = extensionsToLanguages[filename.split('.').pop()!];
                const model = editor.createModel(content, language, Uri.file(`${props.namespace}/${filename}`));
                model.onDidChangeContent(
                    debounce(() => {
                        const newValue = model.getValue();
                        this.lastUpdates[filename] = newValue;
                        this.props.onChange(filename, newValue);
                    }, 200)
                );
                this.models[filename] = model;
                if (solution !== undefined) {
                    this.solutionsModels[filename] = editor.createModel(solution, language);
                }
            }
            this.solutionsFilenames = Object.keys(this.solutionsModels);

            this.instance = editor.create(this.instanceDiv!, {
                ...this.props.options,
                model: this.models[props.selectedFilename],
                readOnly: Boolean(props.values[props.selectedFilename].readOnly),
                renderValidationDecorations: 'on'
            });

            this.instance.layout();

            this.setState({initialized: true});
        }

        public componentWillUnmount() {
            for (const filename of Object.keys(this.models)) {
                this.models[filename].dispose();
            }
            for (const filename of Object.keys(this.solutionsModels)) {
                this.solutionsModels[filename].dispose();
            }
            if (this.instance) {
                this.instance.dispose();
            }
        }

        public componentDidUpdate(prevProps: Readonly<MonacoEditorProps>): void {
            if (!this.instance) {
                return;
            }

            const newSelectedFilename = this.props.selectedFilename;
            if (newSelectedFilename !== prevProps.selectedFilename) {
                const model = this.models[newSelectedFilename];
                this.viewStates[prevProps.selectedFilename] = this.instance.saveViewState()!;
                this.instance.setModel(model);
                this.instance.updateOptions({
                    readOnly: Boolean(this.props.values[newSelectedFilename].readOnly)
                });
                revalidateModel(model);
                const viewState = this.viewStates[newSelectedFilename];
                if (viewState) {
                    this.instance.restoreViewState(viewState);
                }
                this.instance.focus();
            }
            if (this.props.theme !== prevProps.theme) {
                editor.setTheme(this.props.theme || 'vs');
            }
            if (this.props.position !== prevProps.position) {
                if (this.props.position !== undefined) {
                    const model = this.models[this.props.selectedFilename];
                    const position = model.getPositionAt(this.props.position);
                    this.instance.setPosition(position);
                    this.instance.revealLine(position.lineNumber);
                    this.instance.focus();
                }
            }
            if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
                this.instance.layout();
            }
            if (this.props.values !== prevProps.values) {
                for (const [filename, value] of Object.entries(this.props.values)) {
                    if (value.content !== this.lastUpdates[filename]) {
                        this.lastUpdates[filename] = value.content;
                        this.models[filename].setValue(value.content);
                    }
                }
            }
        }

        render() {
            const selectedSolutionFilename = this.getSelectedSolutionFilename();
            return (
                <>
                    <div ref={this.assignRef} style={{width: this.props.width, height: this.props.height}} />
                    {this.state.initialized && this.props.showSolutions && (
                        <DiffDialog
                            selectedFilename={selectedSolutionFilename}
                            original={this.solutionsModels[selectedSolutionFilename]}
                            modified={this.models[selectedSolutionFilename]}
                            onClose={this.props.onSolutionsClose}
                            onSelectFile={this.setSelectedSolutionFilename}
                            filenames={this.solutionsFilenames}
                        />
                    )}
                </>
            );
        }

        setSelectedSolutionFilename = (solutionsSelectedFilename: string) => this.setState({solutionsSelectedFilename});

        getSelectedSolutionFilename() {
            if (this.state && this.state.solutionsSelectedFilename) {
                return this.state.solutionsSelectedFilename;
            }
            return this.solutionsFilenames[0];
        }

        assignRef = (newRef: HTMLElement | null) => (this.instanceDiv = newRef);
    }
);
