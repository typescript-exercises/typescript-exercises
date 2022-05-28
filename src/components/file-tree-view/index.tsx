import styled from '@emotion/styled';
import React, {useCallback, useMemo} from 'react';
import {FileTree} from 'lib/file-tree';
import {DirectoryIcon, FileIcon} from './icons';

interface FileTreeBranch {
    name: string;
    filename: string;
    readOnly: boolean;
    children: FileTreeBranch[];
}

function buildTree(fileTree: FileTree): FileTreeBranch[] {
    const result: FileTreeBranch[] = [];
    const items: {[key: string]: FileTreeBranch} = {};
    for (const filename of Object.keys(fileTree)) {
        const bits = filename.replace(/^\//, '').split('/');
        let parentTreeItem = null;
        const parentTreePath = [];
        while (bits.length > 1) {
            const bit = bits.shift()!;
            parentTreePath.push(bit);
            const parentPath = parentTreePath.join('/');
            if (!items[parentPath]) {
                items[parentPath] = {
                    name: bit,
                    filename: parentPath,
                    readOnly: true,
                    children: []
                };
                if (parentTreeItem) {
                    parentTreeItem.children.push(items[parentPath]);
                } else {
                    result.push(items[parentPath]);
                }
            }
            parentTreeItem = items[parentPath];
        }
        const name = bits.shift()!;
        const item: FileTreeBranch = {
            name,
            filename,
            readOnly: Boolean(fileTree[filename].readOnly),
            children: []
        };
        if (parentTreeItem) {
            parentTreeItem.children.push(item);
        } else {
            result.push(item);
        }
    }
    return result;
}

const FileTreeViewWrapper = styled.div`
    position: relative;
    user-select: none;
`;

const FileTreeBranchWrapper = styled.div`
    margin-left: 15px;
`;

const FileTreeBranchLabelText = styled.div`
    position: relative;
    z-index: 1;
`;

const FileTreeBranchLabelActions = styled.div`
    float: right;
    margin-right: 15px;
    color: gray;
`;

const FileTreeBranchRevert = styled.button`
    background: none;
    color: white;
    cursor: pointer;
    border: none;
    padding: 2px 5px;
    margin-right: -6px;
    &:hover {
        text-decoration: underline;
        text-decoration-style: dotted;
    }
`;

const FileTreeBranchLabel = styled.div<{selected: boolean; selectable: boolean; readOnly: boolean}>`
    display: block;
    cursor: ${({selectable}) => (selectable ? 'pointer' : 'default')};
    pointer-events: ${({selectable}) => (selectable ? 'all' : 'none')};
    color: ${({selected, readOnly}) => (selected ? 'white' : readOnly ? '#555' : 'black')};
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    ${({selected}) =>
        selected
            ? `
                &::before {
                    z-index: 0;
                    display: block;
                    position: absolute;
                    content: '';
                    background: rgb(101,125,176);
                    left: 0;
                    right: 0;
                    height: 30px;
                }`
            : ''}
`;

const FileTreeBranchContent = styled.div``;

function FileTreeViewBranch({
    branch,
    selectedFilename,
    onSelectFilename,
    modifiedFilenames,
    revertFile
}: {
    branch: FileTreeBranch;
    selectedFilename: string;
    onSelectFilename: (filename: string) => void;
    modifiedFilenames: Record<string, true>;
    revertFile: (filename: string) => void;
}) {
    const onClick = useCallback(() => {
        onSelectFilename(branch.filename);
    }, [branch, onSelectFilename]);
    const selected = selectedFilename === branch.filename;
    const isDirectory = branch.children.length > 0;
    const revert = useCallback(() => revertFile(branch.filename), [branch, revertFile]);
    return (
        <FileTreeBranchWrapper>
            <FileTreeBranchLabel
                onClick={onClick}
                selectable={branch.children.length === 0}
                selected={selected}
                readOnly={branch.readOnly}>
                <FileTreeBranchLabelText>
                    {isDirectory ? (
                        <DirectoryIcon color='gray' />
                    ) : (
                        <FileIcon color={selected ? 'rgba(255,255,255,0.75)' : 'gray'} />
                    )}{' '}
                    {branch.name}
                    <FileTreeBranchLabelActions>
                        {modifiedFilenames[branch.filename] &&
                            (selected ? <FileTreeBranchRevert onClick={revert}>revert</FileTreeBranchRevert> : '*')}
                    </FileTreeBranchLabelActions>
                </FileTreeBranchLabelText>
            </FileTreeBranchLabel>
            {isDirectory && (
                <FileTreeBranchContent>
                    {branch.children.map((subBranch) => (
                        <FileTreeViewBranch
                            key={subBranch.filename}
                            branch={subBranch}
                            selectedFilename={selectedFilename}
                            onSelectFilename={onSelectFilename}
                            modifiedFilenames={modifiedFilenames}
                            revertFile={revertFile}
                        />
                    ))}
                </FileTreeBranchContent>
            )}
        </FileTreeBranchWrapper>
    );
}

export function FileTreeView({
    fileTree,
    selectedFilename,
    onSelectFilename,
    modifiedFilenames,
    revertFile
}: {
    fileTree: FileTree;
    selectedFilename: string;
    onSelectFilename: (filename: string) => void;
    modifiedFilenames: Record<string, true>;
    revertFile: (filename: string) => void;
}) {
    const treeItems = useMemo(() => buildTree(fileTree), [fileTree]);
    return (
        <FileTreeViewWrapper>
            {treeItems.map((branch) => (
                <FileTreeViewBranch
                    key={branch.filename}
                    branch={branch}
                    selectedFilename={selectedFilename}
                    onSelectFilename={onSelectFilename}
                    modifiedFilenames={modifiedFilenames}
                    revertFile={revertFile}
                />
            ))}
        </FileTreeViewWrapper>
    );
}
