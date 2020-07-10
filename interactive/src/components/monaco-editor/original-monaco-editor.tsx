import {debounce} from 'debounce';
import {editor, languages, Uri} from 'monaco-editor';
import React from 'react';
import {FileTree} from 'lib/file-tree';
import {revalidateModel} from './revalidate-model';

languages.typescript.typescriptDefaults.setCompilerOptions({
    strict: true,
    target: languages.typescript.ScriptTarget.ES2018,
    moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
    typeRoots: ['declarations']
});

export interface OriginalMonacoEditorProps {
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
}

const extensionsToLanguages: {[ext: string]: string} = {
    ts: 'typescript',
    json: 'json'
};

interface Models {
    [key: string]: editor.IModel;
}

export class OriginalMonacoEditor extends React.Component<OriginalMonacoEditorProps> {
    protected instance: editor.IStandaloneCodeEditor | null = null;
    protected instanceDiv: HTMLElement | null = null;
    protected models: Models = {};
    protected viewStates: {[filename: string]: editor.ICodeEditorViewState} = {};
    protected lastUpdates: {[filename: string]: string} = {};

    public componentDidMount() {
        this.models = Object.keys(this.props.values).reduce((res, filename) => {
            const value = this.props.values[filename].content;
            this.lastUpdates[filename] = value;
            const model = editor.createModel(
                value,
                extensionsToLanguages[filename.split('.').pop()!],
                Uri.file(`${this.props.namespace}/${filename}`)
            );
            model.onDidChangeContent(
                debounce(() => {
                    const newValue = model.getValue();
                    this.lastUpdates[filename] = newValue;
                    this.props.onChange(filename, newValue);
                }, 200)
            );
            res[filename] = model;
            return res;
        }, {} as Models);

        this.instance = editor.create(this.instanceDiv!, {
            ...this.props.options,
            model: this.models[this.props.selectedFilename],
            readOnly: Boolean(this.props.values[this.props.selectedFilename].readOnly),
            renderValidationDecorations: 'on'
        });

        this.instance.layout();
    }

    public componentWillUnmount() {
        for (const filename of Object.keys(this.models)) {
            this.models[filename].dispose();
        }
        if (this.instance) {
            this.instance.dispose();
        }
    }

    public componentDidUpdate(prevProps: Readonly<OriginalMonacoEditorProps>): void {
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
        return (
            <div
                ref={this.assignRef}
                className='original-monaco-editor'
                style={{width: this.props.width, height: this.props.height}}
            />
        );
    }

    assignRef = (newRef: HTMLElement | null) => (this.instanceDiv = newRef);
}
