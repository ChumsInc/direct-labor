import {WorkCenter, WorkCenterList} from "../ducks/types";
import {fetchJSON} from "chums-components";

const workCenterURL = (workCenter:string = '') => '/api/operations/production/wo/chums/work-centers/:workCenter'
    .replace(':workCenter', encodeURIComponent(workCenter));

export async function fetchWorkCenters():Promise<WorkCenterList> {
    try {
        const {workCenters} = await fetchJSON<{ workCenters: WorkCenter[] }>(workCenterURL(), {cache: 'no-cache'});
        const list:WorkCenterList = {};
        workCenters.forEach((wc:WorkCenter) => {
            list[wc.WorkCenterCode] = wc;
        })
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
        const body = JSON.stringify({company: 'chums', workCenter: wc.WorkCenterCode, rate: wc.AverageHourlyRate});
        const url = `/api/operations/production/wo/chums/work-centers/rate/${encodeURIComponent(wc.WorkCenterCode)}`;
        const {workCenter} = await fetchJSON<{workCenter: WorkCenter}>(url, {method: 'POST', body});
        return workCenter ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postWorkCenterRate()", err.message);
            return Promise.reject(err);
        }
        console.debug("postWorkCenterRate()", err);
        return Promise.reject(new Error('Error in postWorkCenterRate()'));
    }
}
