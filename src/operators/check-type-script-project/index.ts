import {Observable, OperatorFunction} from 'rxjs';
import {FileTree} from 'lib/file-tree';
import {ValidationError} from 'lib/validation-error';
import {FileContents} from 'observables/exercise';

interface TypeScriptService extends Worker {
    init(files: FileContents): Promise<void>;
    updateFiles(files: FileContents): Promise<void>;
    getErrors(): Promise<ValidationError[]>;
}

// eslint-disable-next-line import/no-webpack-loader-syntax
const createService = require('workerize-loader!./service.ts') as () => TypeScriptService;

function fileTreeToFileContents(tree: FileTree): FileContents {
    return Object.keys(tree).reduce((res, filename) => {
        res[filename] = tree[filename].content;
        return res;
    }, {} as FileContents);
}

function diffFiles(oldFiles: FileContents, newFiles: FileContents) {
    return Object.keys(newFiles).reduce((res, filename) => {
        if (newFiles[filename] !== oldFiles[filename]) {
            res[filename] = newFiles[filename];
        }
        return res;
    }, {} as FileContents);
}

export function checkTypeScriptProject(): OperatorFunction<FileTree, ValidationError[]> {
    return (parentObservable: Observable<FileTree>): Observable<ValidationError[]> => {
        const service = createService();
        return new Observable((subscriber) => {
            let initialized = false;
            let prevFiles = {} as FileContents;
            const subscription = parentObservable.subscribe(async (files) => {
                const contents = fileTreeToFileContents(files);
                if (!initialized) {
                    initialized = true;
                    prevFiles = contents;
                    await service.init(contents);
                } else {
                    const oldFiles = prevFiles;
                    const newFiles = contents;
                    prevFiles = contents; // Doing this assignment before the the update call. Just in case.
                    await service.updateFiles(diffFiles(oldFiles, newFiles));
                }
                subscriber.next(await service.getErrors());
            });
            subscriber.add(() => {
                service.terminate();
                subscription.unsubscribe();
            });
        });
    };
}
