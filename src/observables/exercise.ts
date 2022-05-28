import debounce from 'debounce';
import {Observable, ReplaySubject} from 'rxjs';
import {exerciseStructures} from 'lib/exercise-structures';
import {FileTree} from 'lib/file-tree';
import {localData} from 'lib/local-data';

export interface FileContents {
    [filename: string]: string;
}

function createModifiedFileTree(contents: FileContents, tree: FileTree) {
    const result: FileTree = {};
    for (const filename of Object.keys(tree)) {
        if (Object.prototype.hasOwnProperty.call(contents, filename)) {
            result[filename] = {
                content: contents[filename],
                solution: tree[filename].solution,
                readOnly: tree[filename].readOnly
            };
        } else {
            result[filename] = tree[filename];
        }
    }
    return result;
}

interface Exercise {
    observable$: Observable<FileTree>;
    update(filename: string, code: string): void;
    revert(fileName: string): void;
}

const exercisesCache: {[key: number]: Exercise} = {};

export function createExercise(exerciseNumber: number) {
    if (!exercisesCache[exerciseNumber]) {
        const localStorageKey = `exercise.${exerciseNumber}`;
        const exerciseOriginalFiles = exerciseStructures[exerciseNumber];

        let files = localData.get(localStorageKey, {} as FileContents);

        const saveToLocalStorage = debounce(() => {
            localData.set(localStorageKey, files);
        }, 500);

        const subject = new ReplaySubject<FileTree>(1);
        subject.next(createModifiedFileTree(files, exerciseOriginalFiles));

        exercisesCache[exerciseNumber] = {
            observable$: subject,
            update(filename: string, code: string) {
                files = {...files, [filename]: code};
                saveToLocalStorage();
                subject.next(createModifiedFileTree(files, exerciseOriginalFiles));
            },
            revert(filename: string) {
                files = {...files};
                delete files[filename];
                saveToLocalStorage();
                subject.next(createModifiedFileTree(files, exerciseOriginalFiles));
            }
        };
    }

    return exercisesCache[exerciseNumber];
}
