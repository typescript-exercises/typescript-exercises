import {editor, Uri, languages} from 'monaco-editor';
import React from 'react';
import {FileTree} from 'lib/file-tree';
import {revalidateModel} from './revalidate-model';

languages.typescript.typescriptDefaults.setCompilerOptions({
    strict: true
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
    onSwitchFile: (filename: string) => void;
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

    public componentDidMount() {
        this.models = Object.keys(this.props.values).reduce((res, filename) => {
            const model = editor.createModel(
                this.props.values[filename].content,
                extensionsToLanguages[filename.split('.').pop()!],
                Uri.file(`${this.props.namespace}/${filename}`)
            );
            model.onDidChangeContent(() => this.props.onChange(filename, model.getValue()));
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
