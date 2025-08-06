import {fetchJSON} from "@chumsinc/ui-utils";
import type {ActivityCode, WorkTemplateStep} from "chums-types";
import type {LoadActivityCodeResponse} from "../types";

export async function fetchActivityCodes():Promise<ActivityCode[]> {
    try {
        const url = '/api/operations/production/pm/activity-codes.json';
        const res = await fetchJSON<ActivityCode[]>(url, {cache: 'no-cache'});
        return res ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchActivityCodes()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchActivityCodes()", err);
        return Promise.reject(new Error('Error in fetchActivityCodes()'));
    }
}

export async function fetchActivityCode(arg:Pick<ActivityCode, 'WorkCenter'|'ActivityCode'>):Promise<LoadActivityCodeResponse|null> {
    try {
        const url = '/api/operations/production/pm/activity-codes/:workCenter/:activityCode.json'
            .replace(':workCenter', encodeURIComponent(arg.WorkCenter))
            .replace(':activityCode', encodeURIComponent(arg.ActivityCode));
        const res = await fetchJSON<{activityCode: ActivityCode, steps: WorkTemplateStep[]}>(url, {cache: 'no-cache'});
        return res ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchActivityCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchActivityCode()", err);
        return Promise.reject(new Error('Error in fetchActivityCode()'));
    }
}
