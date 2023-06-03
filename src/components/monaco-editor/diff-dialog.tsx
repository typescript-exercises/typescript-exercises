import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import {editor} from 'monaco-editor';
import React, {useMemo} from 'react';
import {CollapsiblePanel} from 'components/collapsible-panel';
import {Dialog} from 'components/dialog';
import {FileTitle} from 'components/file-title';
import {FileTreeView} from 'components/file-tree-view';
import {MonacoDiffViewer} from 'components/monaco-diff-viewer';
import {FileTree} from 'lib/file-tree';

interface DiffDialogProps {
    original: editor.IModel;
    modified: editor.IModel;
    selectedFilename: string;
    filenames: string[];
    onSelectFile: (filename: string) => void;
    onClose: () => void;
}

const Panes = styled.div`
    display: flex;
    height: 100%;
    border: 1px #ddd solid;
`;

const EditorArea = styled.div`
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
`;

const EditorAreaCaption = styled.div<{backgroundColor: string; color: string}>`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex: 0 0 30px;
    background: ${(props) => props.backgroundColor};
    color: ${(props) => props.color};
`;

const EditorAreaTitle = styled.div`
    font-size: 14px;
`;

const EditorAreaContent = styled.div`
    flex: 1 1 auto;
    position: relative;
    border-top: 1px #ddd solid;
`;

const noop = () => null;

function createTreeFromFilenames(filenames: string[]): FileTree {
    return filenames.reduce((result, filename) => {
        result[filename] = {content: ''};
        return result;
    }, {} as FileTree);
}

export function DiffDialog(props: DiffDialogProps) {
    const {onClose, filenames, selectedFilename, onSelectFile, ...otherProps} = props;
    const fileTree = useMemo(() => createTreeFromFilenames(filenames), [filenames]);
    const theme = useTheme();
    return (
        <Dialog onClose={onClose}>
            <Panes>
                <CollapsiblePanel id='solutionFiles' header='Files' orientation='vertical'>
                    <FileTreeView
                        fileTree={fileTree}
                        selectedFilename={selectedFilename}
                        onSelectFilename={onSelectFile}
                        modifiedFilenames={{}}
                        revertFile={noop}
                    />
                </CollapsiblePanel>
                <EditorArea>
                    <FileTitle filename={selectedFilename} readOnly={false} />
                    <EditorAreaCaption backgroundColor={theme.background} color={theme.color}>
                        <EditorAreaTitle>Possible solution</EditorAreaTitle>
                        <EditorAreaTitle>Current version</EditorAreaTitle>
                    </EditorAreaCaption>
                    <EditorAreaContent>
                        <MonacoDiffViewer {...otherProps} />
                    </EditorAreaContent>
                </EditorArea>
            </Panes>
        </Dialog>
    );
}
