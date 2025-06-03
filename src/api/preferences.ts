const reLocal = /^local/;

const sessionStoragePrefix:string = 'session/direct-labor';
const localStoragePrefix:string = 'local/direct-labor';


export const sessionStorageKeys = {
};

export const localStorageKeys = {
    dlStepsRowsPerPage: `${localStoragePrefix}/dlSteps/rowsPerPage`,
    dlStepsTimingInputMode: `${localStoragePrefix}/dlSteps/timingInputMode`,
    dlCodesRowsPerPage: `${localStoragePrefix}/dlCodes/rowsPerPage`,
    dlCodesShowInactive: `${localStoragePrefix}/dlCodes/showInactive`,
    dlCodesWorkCenter: `${localStoragePrefix}/dlCodes/workCenter`,
    opCodesRowsPerPage: `${localStoragePrefix}/opCodes/rowsPerPage`,
    opCodesWorkCenter: `${localStoragePrefix}/opCodes/workCenter`,
    routingRowsPerPage: `${localStoragePrefix}/opCodes/rowsPerPage`,
    routingShowInactive: `${localStoragePrefix}/dlCodes/showInactive`,
    ratedWorkCenters: `${localStoragePrefix}/workCenters/ratedWorkCenters`,
    templateWURowsPerPage: `${localStoragePrefix}/templates/where-used/rowsPerPage`
}
function getStorage(key:string):Storage {
    return reLocal.test(key) ? window.localStorage : window.sessionStorage;
}

export const setPreference = <T=unknown>(key:string, value:T) => {
    try {
        if (typeof window === 'undefined') {
            return;
        }
        getStorage(key).setItem(key, JSON.stringify(value));
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
    getStorage(key).removeItem(key);
}

export const getPreference = <T = unknown>(key:string, defaultValue: T):T => {
    try {
        if (typeof window === 'undefined') {
            return defaultValue;
        }
        const value = getStorage(key).getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return JSON.parse(value) ?? defaultValue;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("getPreference()", err.message);
            return defaultValue;
        }
        console.log("getPreference()", err);
        return defaultValue;
    }
};
