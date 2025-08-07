const localStoragePrefix:string = 'com.chums.intranet.direct-labor';
export const currentTabStorageKey: string = `${localStoragePrefix}.current-tab`;
export const currentOCWorkCenterKey: string = `${localStoragePrefix}.current-operation-work-center`;
export const currentMenuCollapseKey: string = `${localStoragePrefix}.current-menu-collapse`;
export const showInactiveStepsKey: string = `${localStoragePrefix}.show-inactive-steps`;
export const filterInactiveCodesKey: string = `${localStoragePrefix}.filter-inactive-codes`;

export const setPreference = (key:string, value:unknown) => {
    try {
        if (typeof window === 'undefined') {
            return;
        }
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("setPreference()", err.message);
            return;
        }
        console.log("setPreference()", err);
    }
};

export const clearPreference = (key:string) => {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.removeItem(key);
}

export const getPreference = (key:string, defaultValue: unknown) => {
    try {
        if (typeof window === 'undefined') {
            return defaultValue;
        }
        const value = window.localStorage.getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return JSON.parse(value);
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("getPreference()", err.message);
            return defaultValue;
        }
        console.log("getPreference()", err);
        return defaultValue;
    }
};
