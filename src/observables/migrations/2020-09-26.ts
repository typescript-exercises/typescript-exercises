interface OldExercisesProgress {
    currentExerciseNumber: number;
    lastCompletedExerciseNumber: number;
}

interface NewExercisesProgress {
    completedExercises: Record<string, boolean>;
}

export function migrate() {
    const localStorageKey = 'exercisesProgress';
    const oldValueRaw = localStorage.getItem(localStorageKey);
    if (oldValueRaw) {
        try {
            const oldValue = JSON.parse(oldValueRaw) as OldExercisesProgress | NewExercisesProgress;
            if ('lastCompletedExerciseNumber' in oldValue) {
                const newValue: NewExercisesProgress = {completedExercises: {}};
                for (let i = 1; i <= oldValue.lastCompletedExerciseNumber; i++) {
                    newValue.completedExercises[i] = true;
                }
                localStorage.setItem(localStorageKey, JSON.stringify(newValue));
            }
        } catch (e) {
            localStorage.removeItem(localStorageKey);
        }
    }
}
