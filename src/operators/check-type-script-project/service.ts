import ts, {FormatDiagnosticsHost} from 'typescript';
import {ValidationError} from 'lib/validation-error';
import {FileContentTree, InMemoryFileSystem} from './in-memory-file-system';

let fs: InMemoryFileSystem;
let program: ts.WatchOfFilesAndCompilerOptions<ts.BuilderProgram>;

export function init(files: FileContentTree) {
    fs = new InMemoryFileSystem(files);
    program = ts.createWatchProgram(
        ts.createWatchCompilerHost(
            ['test', 'index'],
            {
                strict: true,
                lib: ['lib.es2018.d.ts', 'lib.dom.d.ts'],
                typeRoots: ['declarations']
            },
            fs
        )
    );
}

export function updateFiles(files: FileContentTree) {
    if (!fs) {
        return;
    }
    for (const filename of Object.keys(files)) {
        fs.updateFile(filename, files[filename]);
    }
}

const formatDiagnosticsHost: FormatDiagnosticsHost = {
    getCanonicalFileName: (filename) => filename,
    getCurrentDirectory: () => '/',
    getNewLine: () => '\n'
};

export function getErrors(): ValidationError[] {
    if (!program) {
        return [];
    }
    const project = program.getProgram();
    return ts.getPreEmitDiagnostics(project.getProgram()).map((error) => ({
        messageText: ts.formatDiagnostic(error, formatDiagnosticsHost),
        length: error.length!,
        start: error.start!,
        file: error.file ? (error.file as unknown as {resolvedPath: string}).resolvedPath : null
    }));
}
