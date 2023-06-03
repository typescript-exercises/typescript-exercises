import qs from 'qs';
import {ReplaySubject} from 'rxjs';

interface UrlParams {
    exercise: string;
    file: string;
}

const defaultUrlParams = {
    exercise: '1',
    file: '/index.ts'
};

export const urlParams = (() => {
    const getCurrentRawParams = () => qs.parse(String(window.location.hash).substr(1));
    const getCurrentParams = () => Object.assign({}, defaultUrlParams, getCurrentRawParams());

    const subject = new ReplaySubject<UrlParams>(1);

    subject.next(getCurrentParams());

    window.addEventListener('hashchange', () => subject.next(getCurrentParams()));

    return {
        observable$: subject,
        getCurrentRawParams,
        extend(params: Partial<UrlParams>) {
            window.location.hash = `#${qs.stringify(Object.assign(getCurrentParams(), params))}`;
        }
    };
})();
