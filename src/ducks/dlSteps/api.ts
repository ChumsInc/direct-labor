import {DLSteps} from "../types";
import {LoadDLStepResponse, LoadDLStepsResponse} from "./types";
import {fetchJSON} from "chums-components";
import {DLBasicStep, DLCode, DLStep} from "chums-types";

const listURL = `/api/operations/production/dl/steps`;
const stepURL = (step: DLBasicStep) => `/api/operations/production/dl/steps/${encodeURIComponent(step.id)}`;

export async function fetchDLSteps():Promise<LoadDLStepsResponse> {
    try {
        const response = await fetchJSON<LoadDLStepsResponse>(listURL, {cache: 'no-cache'});
        return {
            steps: response?.steps ?? [],
            machines: response?.machines ?? []
        };
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLSteps()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLSteps()", err);
        return Promise.reject(new Error('Error in fetchDLSteps()'));
    }
}

export async function fetchDLStep(arg:number|string):Promise<DLStep|null> {
    try {
        const url = `/api/operations/production/dl/steps/${encodeURIComponent(arg)}.json`;
        const res = await fetchJSON<LoadDLStepResponse>(url, {cache: 'no-cache'});
        return res?.step ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLStep()", err);
        return Promise.reject(new Error('Error in fetchDLStep()'));
    }
}

export async function fetchDLStepWhereUsed(arg:number|string):Promise<DLCode[]> {
    try {
        const url = `/api/operations/production/dl/steps/${encodeURIComponent(arg)}/where-used.json`;
        const res = await fetchJSON<{ whereUsed: DLCode[] }>(url, {cache: 'no-cache'});
        return res?.whereUsed ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLStep()", err);
        return Promise.reject(new Error('Error in fetchDLStep()'));
    }
}

export async function postDLStep(arg:DLStep):Promise<DLStep|null> {
    try {
        const url = `/api/operations/production/dl/steps/${encodeURIComponent(arg.id)}`;
        const body = JSON.stringify(arg);
        const res = await fetchJSON<LoadDLStepResponse>(url, {method: 'POST', body});
        return res?.step ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postDLStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("postDLStep()", err);
        return Promise.reject(new Error('Error in postDLStep()'));
    }
}
