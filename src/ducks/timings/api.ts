import {DLStep, StepTiming} from "chums-types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {SaveTimingResponse, StepTimingId} from "./types";


export async function postTiming(arg: StepTiming): Promise<SaveTimingResponse|null> {
    try {
        const url = '/api/operations/production/dl/steps/:stepId/timings/:timingId.json'
            .replace(':stepId', encodeURIComponent(arg.idSteps))
            .replace(':timingId', encodeURIComponent(arg.id))
            .replace('/0.json', '.json');
        const method = !!arg.id ? 'PUT' : 'POST';
        const res = await fetchJSON<SaveTimingResponse>(url, {method, body: JSON.stringify(arg)});
        return res ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postTiming()", err.message);
            return Promise.reject(err);
        }
        console.debug("postTiming()", err);
        return Promise.reject(new Error('Error in postTiming()'));
    }
}

export async function fetchTiming(arg:StepTimingId):Promise<StepTiming|null> {
    try {
        const url = '/api/operations/production/dl/steps/:stepId/timings/:timingId.json'
            .replace(':stepId', encodeURIComponent(arg.idSteps))
            .replace(':timingId', encodeURIComponent(arg.id));
        const res = await fetchJSON<{timings: StepTiming[]}>(url, {cache: 'no-cache'});
        return res?.timings?.[0] ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchTiming()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTiming()", err);
        return Promise.reject(new Error('Error in fetchTiming()'));
    }
}

export async function postApplyTiming(arg:StepTimingId):Promise<DLStep|null> {
    try {
        const url = `/api/operations/production/dl/steps/:stepId/timings/:timingId/apply.json`
            .replace(':stepId', encodeURIComponent(arg.idSteps))
            .replace(':timingId', encodeURIComponent(arg.id));
        const res = await fetchJSON<{step: DLStep}>(url, {method: 'PUT'});
        return res?.step ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postApplyTiming()", err.message);
            return Promise.reject(err);
        }
        console.debug("postApplyTiming()", err);
        return Promise.reject(new Error('Error in postApplyTiming()'));
    }
}
