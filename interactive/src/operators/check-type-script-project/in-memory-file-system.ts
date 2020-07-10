// eslint-disable-next-line no-restricted-imports
import {resolve} from 'path';
import ts, {FileWatcherEventKind} from 'typescript';

/* eslint import/no-webpack-loader-syntax: off */

interface File {
    content: string;
    modifiedTime: Date;
}

export interface FileContentTree {
    [filename: string]: string;
}

interface FileTree {
    [filename: string]: File;
}

const unique = (ss: string[]) =>
    Object.keys(
        ss.reduce((r, s) => {
            r[s] = true;
            return r;
        }, {} as {[k: string]: true})
    );

const ROOT = '/';

const tsLibsContext = require.context('!!raw-loader!typescript/lib', true, /\.d\.ts$/);

const tsLibs = tsLibsContext.keys().reduce((acc, filename) => {
    acc[`/_internal/${filename.replace(/^\.\//, '')}`] = tsLibsContext(filename).default;
    return acc;
}, {} as {[filename: string]: string});

function resolvePathWrapper<T>(operation: (f: string) => T): (f: string) => T;
function resolvePathWrapper<T, A1>(operation: (f: string, a1: A1) => T): (f: string, a1: A1) => T;
function resolvePathWrapper<T, O>(operation: (filename: string, ...other: O[]) => T) {
    return (filename: string, ...other: O[]) => operation(resolve(ROOT, filename), ...other);
}

export class InMemoryFileSystem implements ts.System {
    args: string[] = [];
    newLine = '\n';
    useCaseSensitiveFileNames = true;
    files: FileTree;
    directoryWatchers: {[path: string]: {recursive?: boolean; callback: ts.DirectoryWatcherCallback}} = {};
    fileWatchers: {[path: string]: ts.FileWatcherCallback} = {};

    constructor(files: FileContentTree) {
        files = {
            ...files,
            ...tsLibs
        };
        const modifiedTime = new Date();
        this.files = Object.keys(files).reduce((res, filename) => {
            res[filename] = {
                content: files[filename],
                modifiedTime
            };
            return res;
        }, {} as FileTree);
    }

    protected getFilenames = () => Object.keys(this.files);

    updateFile(path: string, content: string) {
        this.files[path] = {
            content,
            modifiedTime: new Date()
        };
        if (this.fileWatchers[path]) {
            this.fileWatchers[path](path, FileWatcherEventKind.Changed);
        }
    }

    createDirectory = () => null;
    deleteFile = () => null;

    directoryExists = resolvePathWrapper((path: string) => {
        if (path === '/') {
            return true;
        }
        return this.getFilenames().some((filename) => filename.indexOf(`${path}/`) === 0);
    });

    exit = () => null;

    fileExists = resolvePathWrapper((filename: string) => Object.prototype.hasOwnProperty.call(this.files, filename));

    getCurrentDirectory(): string {
        return ROOT;
    }

    getDirectories = resolvePathWrapper((path: string) =>
        unique(
            this.getFilenames()
                .filter((fn) => fn.indexOf(`${path}/`) === 0)
                .map(
                    (fn) =>
                        fn
                            .slice(path.length + 1)
                            .split('/')
                            .shift() || ''
                )
                .filter((fn) => fn && fn.indexOf('.') === -1)
        )
    );

    getExecutingFilePath(): string {
        return '/_internal/node';
    }

    getFileSize = resolvePathWrapper((path: string) => (this.files[path] ? this.files[path].content.length : 0));
    getModifiedTime = resolvePathWrapper((path: string) =>
        this.files[path] ? this.files[path].modifiedTime : undefined
    );

    readDirectory = () => [];

    readFile = resolvePathWrapper((path: string) => (this.files[path] ? this.files[path].content : undefined));

    resolvePath = resolvePathWrapper((path: string) => path);

    setModifiedTime = resolvePathWrapper((path: string, time: Date) => {
        if (this.files[path]) {
            this.files[path].modifiedTime = time;
        }
    });

    watchDirectory = resolvePathWrapper(
        (path: string, callback: ts.DirectoryWatcherCallback, recursive?: boolean): ts.FileWatcher => {
            this.directoryWatchers[path] = {callback, recursive};
            return {close: () => delete this.directoryWatchers[path]};
        }
    );

    watchFile = resolvePathWrapper(
        (path: string, callback: ts.FileWatcherCallback): ts.FileWatcher => {
            this.fileWatchers[path] = callback;
            return {close: () => delete this.fileWatchers[path]};
        }
    );

    write = () => null;
    writeFile = () => null;

    writeOutputIsTTY(): boolean {
        return false;
    }
}
