import {fetchJSON} from "chums-components";

export async function fetchVersion():Promise<string|null> {
    try {
        const url = `./package.json`;
        const {version} = await fetchJSON<{version: string}>(url);
        return version ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchVersion()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVersion()", err);
        return Promise.reject(new Error('Error in fetchVersion()'));
    }
}
