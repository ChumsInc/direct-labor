import type {RoutingResponse} from "../types";
import {fetchJSON} from "@chumsinc/ui-utils";
import type {RoutingHeader} from "chums-types";

export async function fetchRouting(arg:string):Promise<RoutingResponse|null> {
    try {
        const url = `/api/operations/production/wo/routings/:routingNo.json`
            .replace(':routingNo', encodeURIComponent(arg));
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
        const url = `/api/operations/production/wo/routings.json`;
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
