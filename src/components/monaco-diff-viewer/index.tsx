import {editor} from 'monaco-editor';
import React from 'react';
import {decorateWithAutoResize} from 'components/auto-resizer';

interface MonacoDiffViewerProps {
    width?: string | number;
    height?: string | number;
    original: editor.IModel;
    modified: editor.IModel;
    options?: editor.IDiffEditorConstructionOptions;
}

export const MonacoDiffViewer = decorateWithAutoResize(
    class extends React.Component<MonacoDiffViewerProps> {
        protected instance: editor.IStandaloneDiffEditor | null = null;
        protected instanceDiv: HTMLElement | null = null;
        assignRef = (newRef: HTMLElement | null) => (this.instanceDiv = newRef);

        public componentDidMount() {
            this.instance = editor.createDiffEditor(this.instanceDiv!, {
                ...this.props.options,
                renderValidationDecorations: 'on'
            });
            this.setModels();
        }

        protected setModels() {
            const {original, modified} = this.props;
            this.instance!.setModel({
                original,
                modified
            });
        }

        public componentDidUpdate(prevProps: Readonly<MonacoDiffViewerProps>): void {
            if (this.props.modified !== prevProps.modified || this.props.original !== prevProps.original) {
                this.setModels();
            }
            if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
                this.instance!.layout();
            }
        }

        public componentWillUnmount() {
            if (this.instance) {
                this.instance.dispose();
            }
        }

        render() {
            return <div ref={this.assignRef} style={{width: this.props.width, height: this.props.height}} />;
        }
    }
);
