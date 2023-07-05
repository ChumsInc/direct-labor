import {FetchTimingArg, SaveTimingResponse} from "../ducks/types";
import {fetchJSON} from "chums-components";
import {DLStep, StepTiming} from "chums-types";


const timingsURL = (id: number, idTimings?: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}/timings/${encodeURIComponent(idTimings || '')}`;
const applyTimingsURL = (id: number, idTiming: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}/timing/${encodeURIComponent(idTiming)}`;

export async function fetchTimings(arg:FetchTimingArg):Promise<StepTiming[]> {
    try {
        const {stepId, timingId} = arg;
        const url = timingsURL(stepId, timingId);
        const res = await fetchJSON<{timings?: StepTiming[]}>(url, {cache: 'no-cache'});
        return res.timings ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchTimings()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTimings()", err);
        return Promise.reject(new Error('Error in fetchTimings()'));
    }
}

export async function postTiming(arg: StepTiming): Promise<SaveTimingResponse> {
    try {
        const url = timingsURL(arg.idSteps, arg.id);
        const method = !!arg.idSteps ? 'PUT' : 'POST';
        return await fetchJSON<SaveTimingResponse>(url, {method, body: JSON.stringify(arg)});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postTiming()", err.message);
            return Promise.reject(err);
        }
        console.debug("postTiming()", err);
        return Promise.reject(new Error('Error in postTiming()'));
    }
}

export async function postApplyTiming(arg:StepTiming):Promise<DLStep|null> {
    try {
        const url = applyTimingsURL(arg.idSteps, arg.id);
        const {step} = await fetchJSON<{step?:DLStep}>(url, {method: 'PUT'});
        return step ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postApplyTiming()", err.message);
            return Promise.reject(err);
        }
        console.debug("postApplyTiming()", err);
        return Promise.reject(new Error('Error in postApplyTiming()'));
    }
}
