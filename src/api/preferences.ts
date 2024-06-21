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
}
function getStorage(key:string):Storage {
    return reLocal.test(key) ? window.localStorage : window.sessionStorage;
}

export const setPreference = <T=any>(key:string, value:T) => {
    try {
        if (!global.window) {
            return;
        }
        getStorage(key).setItem(key, JSON.stringify(value));
    } catch(err:any) {
        console.log("setPreference()", err.message);
    }
};

export const clearPreference = (key:string) => {
    if (typeof window === 'undefined') {
        return;
    }
    getStorage(key).removeItem(key);
}

export const getPreference = <T = any>(key:string, defaultValue: T):T => {
    try {
        if (!global.window) {
            return defaultValue;
        }
        const value = getStorage(key).getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return JSON.parse(value) ?? defaultValue;
    } catch(err:any) {
        console.log("getPreference()", err.message);
        return defaultValue;
    }
};
