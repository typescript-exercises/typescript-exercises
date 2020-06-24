export const localData = {
    get<T>(key: string, defaultValue: T): T {
        const data = localStorage.getItem(key);
        if (data === null) {
            return defaultValue;
        }
        return JSON.parse(data);
    },
    set(key: string, value: unknown) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
