import React, {useEffect, useMemo, useState} from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import {Observable} from 'rxjs';

function Loading() {
    return <PulseLoader color='gray' />;
}

type RenderCallback<T> = (value: T) => React.ReactNode;

function LoadingContainer<T>({observable, render}: {observable: Observable<T>; render: RenderCallback<T>}) {
    const [lastUpdate, setLastUpdate] = useState(undefined as undefined | T);

    const [cachedUpdate, subscription] = useMemo(() => {
        let triggerUpdate = false;
        let cachedUpdate: undefined | T;
        const subscription = observable.subscribe((update) => {
            if (triggerUpdate) {
                setLastUpdate(update);
            } else {
                cachedUpdate = update;
            }
        });
        triggerUpdate = true;
        return [cachedUpdate, subscription];
    }, [observable, setLastUpdate]);

    useEffect(() => () => subscription.unsubscribe(), [subscription]);

    const update = lastUpdate !== undefined ? lastUpdate : cachedUpdate;

    if (update === undefined) {
        return <Loading />;
    }

    return <>{render(update)}</>;
}

export function load<T>(observable: Observable<T>, render: RenderCallback<T>) {
    return <LoadingContainer observable={observable} render={render} />;
}
