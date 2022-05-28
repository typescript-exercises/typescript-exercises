import React, {useLayoutEffect, useMemo, useState} from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import {Observable, Subscription} from 'rxjs';

function Loading() {
    return <PulseLoader color='gray' />;
}

type RenderCallback<T> = (value: T) => React.ReactNode;

function useObservable<T>(observable: Observable<T>): T | undefined {
    const [, setUpdate] = useState(false);

    const {subscription, value} = useMemo(() => {
        const state = {
            value: undefined as T | undefined,
            subscription: undefined as Subscription | undefined
        };
        let emitChanges = false;
        state.subscription = observable.subscribe((newValue) => {
            state.value = newValue;
            if (emitChanges) {
                setUpdate((update) => !update);
            }
        });
        emitChanges = true;
        return state;
    }, [observable, setUpdate]);

    useLayoutEffect(() => () => subscription?.unsubscribe(), [subscription]);

    return value;
}

function LoadingContainer<T>({observable, render}: {observable: Observable<T>; render: RenderCallback<T>}) {
    const update = useObservable(observable);

    if (update === undefined) {
        return <Loading />;
    }

    return <>{render(update)}</>;
}

export function load<T>(observable: Observable<T>, render: RenderCallback<T>) {
    return <LoadingContainer observable={observable} render={render} />;
}
