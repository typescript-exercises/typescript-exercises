import {editor, Uri, languages} from 'monaco-editor';
import React from 'react';
import ReactDom from 'react-dom';

languages.typescript.typescriptDefaults.setCompilerOptions({
    strict: true
});

export interface OriginalMonacoEditorProps {
    width?: string | number;
    height?: string | number;
    theme?: string;
    options?: any;
    namespace: string;
    values: {[filename: string]: string};
    selectedFilename: string;
    onChange: (filename: string, content: string) => void;
}

const extensionsToLanguages: {[ext: string]: string} = {
    ts: 'typescript',
    json: 'json'
};

type Models = {[key: string]: editor.IModel};

export class OriginalMonacoEditor extends React.Component<OriginalMonacoEditorProps> {
    protected instance: editor.IStandaloneCodeEditor | null = null;
    protected instanceDiv: HTMLElement | null = null;
    protected models: Models = {};

    public componentDidMount() {
        this.models = Object.keys(this.props.values).reduce((res, filename) => {
            const model = editor.createModel(
                this.props.values[filename],
                extensionsToLanguages[filename.split('.').pop()!],
                Uri.file(`${this.props.namespace}/${filename}`)
            );
            model.onDidChangeContent(() => this.props.onChange(filename, model.getValue()));
            res[filename] = model;
            return res;
        }, {} as Models);
        this.instance = editor.create(
            ReactDom.findDOMNode(this.instanceDiv) as HTMLElement,
            {
                ...this.props.options,
                model: this.models[this.props.selectedFilename]
            }
        );
        this.instance.layout();
    }

    public componentWillUnmount() {
        if (this.instance) {
            this.instance.dispose();
        }
    }

    public componentDidUpdate(
        prevProps: Readonly<OriginalMonacoEditorProps>,
        prevState: Readonly<{}>
    ): void {
        if (this.props.selectedFilename !== prevProps.selectedFilename) {
            this.instance?.setModel(this.models[this.props.selectedFilename]);

        }
        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this.instance?.layout();
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

    assignRef = (newRef: HTMLElement | null) => this.instanceDiv = newRef;
}

