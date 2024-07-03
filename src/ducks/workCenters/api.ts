import {WorkCenterList} from "../types";
import {fetchJSON} from "chums-components";
import {WorkCenter} from "chums-types";
import {localStorageKeys, setPreference} from "../../api/preferences";

export async function fetchWorkCenter(arg:string):Promise<WorkCenter|null> {
    try {
        const url = '/api/operations/production/pm/work-centers/:workCenter.json'
            .replace(':workCenter', encodeURIComponent(arg));
        const res = await fetchJSON<{ workCenter: WorkCenter }>(url, {cache: 'no-cache'});
        return res?.workCenter ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkCenters()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkCenters()", err);
        return Promise.reject(new Error('Error in fetchWorkCenters()'));
    }
}

export async function fetchWorkCenters():Promise<WorkCenterList> {
    try {
        const url = '/api/operations/production/pm/work-centers.json';
        const res = await fetchJSON<{ workCenters: WorkCenter[] }>(url, {cache: 'no-cache'});
        const list:WorkCenterList = {};
        res?.workCenters.forEach((wc:WorkCenter) => {
            list[wc.workCenter] = wc;
        });
        const ratedWorkCenters = res?.workCenters?.filter(wc => wc.isStandardWC)?.map(wc => wc.workCenter.toUpperCase()) ?? [];
        setPreference<string[]>(localStorageKeys.ratedWorkCenters, ratedWorkCenters)
        return list;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkCenters()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkCenters()", err);
        return Promise.reject(new Error('Error in fetchWorkCenters()'));
    }
}

export async function postWorkCenterRate(wc:WorkCenter):Promise<WorkCenter|null> {
    try {
        const body = JSON.stringify(wc);
        let url = '/api/operations/production/pm/work-centers.json';
        let method = 'POST'
        if (wc.id) {
            url = `/api/operations/production/pm/work-centers/${encodeURIComponent(wc.workCenter)}.json`;
            method = 'PUT'
        }
        const res = await fetchJSON<{workCenter: WorkCenter}>(url, {method, body});
        return res?.workCenter ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postWorkCenterRate()", err.message);
            return Promise.reject(err);
        }
        console.debug("postWorkCenterRate()", err);
        return Promise.reject(new Error('Error in postWorkCenterRate()'));
    }
}
