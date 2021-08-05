export const setPreference = (key:string, value:any) => {
    try {
        if (!global.window) {
            return;
        }
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch(err) {
        console.log("setPreference()", err.message);
    }
};

export const clearPreference = (key:string) => {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.removeItem(key);
}

export const getPreference = (key:string, defaultValue: any) => {
    try {
        if (!global.window) {
            return defaultValue;
        }
        const value = window.localStorage.getItem(key);
        if (value === null) {
            return defaultValue;
        }
        return JSON.parse(value);
    } catch(err) {
        console.log("getPreference()", err.message);
        return defaultValue;
    }
};
