import {RoutingResponse} from "../types";
import {fetchJSON} from "chums-components";
import {RoutingHeader} from "chums-types";

export async function fetchRouting(arg:string):Promise<RoutingResponse|null> {
    try {
        const url = `/api/operations/production/wo/chums/routings/${encodeURIComponent(arg)}`;
        return await fetchJSON<RoutingResponse>(url, {cache: 'no-cache'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchRouting()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchRouting()", err);
        return Promise.reject(new Error('Error in fetchRouting()'));
    }
}

export async function fetchRoutings():Promise<RoutingHeader[]> {
    try {
        const url = `/api/operations/production/wo/chums/routings`;
        const res = await fetchJSON<{ routingHeader:RoutingHeader[] }>(url, {cache: 'no-cache'});
        return res?.routingHeader ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchRoutings()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchRoutings()", err);
        return Promise.reject(new Error('Error in fetchRoutings()'));
    }
}
