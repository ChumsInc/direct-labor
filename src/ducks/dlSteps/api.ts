import type {LoadDLStepResponse, LoadDLStepsResponse} from "./types";
import {fetchJSON} from "@chumsinc/ui-utils";
import type {DLCode, DLStep} from "chums-types";

export async function fetchDLSteps(): Promise<LoadDLStepsResponse> {
    try {
        const url = `/api/operations/production/dl/steps.json`;
        const response = await fetchJSON<LoadDLStepsResponse>(url, {cache: 'no-cache'});
        return {
            steps: response?.steps ?? [],
            machines: response?.machines ?? []
        };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLSteps()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLSteps()", err);
        return Promise.reject(new Error('Error in fetchDLSteps()'));
    }
}

export async function fetchDLStep(arg: number | string): Promise<DLStep | null> {
    try {
        const url = `/api/operations/production/dl/steps/:id.json`
            .replace(':id', encodeURIComponent(arg))
        const res = await fetchJSON<LoadDLStepResponse>(url, {cache: 'no-cache'});
        return res?.step ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLStep()", err);
        return Promise.reject(new Error('Error in fetchDLStep()'));
    }
}

export async function fetchDLStepWhereUsed(arg: number | string): Promise<DLCode[]> {
    try {
        const url = `/api/operations/production/dl/steps/:id/where-used.json`
            .replace(':id', encodeURIComponent(arg));
        const res = await fetchJSON<{ whereUsed: DLCode[] }>(url, {cache: 'no-cache'});
        return res?.whereUsed ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLStep()", err);
        return Promise.reject(new Error('Error in fetchDLStep()'));
    }
}

export async function postDLStep(arg: DLStep): Promise<DLStep | null> {
    try {
        const url = arg.id
            ? `/api/operations/production/dl/steps/:id.json`
                .replace(':id', encodeURIComponent(arg.id))
            : '/api/operations/production/dl/steps.json';
        const method = arg.id ? 'PUT' : 'POST';
        const body = JSON.stringify(arg);
        const res = await fetchJSON<LoadDLStepResponse>(url, {method, body});
        return res?.step ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postDLStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("postDLStep()", err);
        return Promise.reject(new Error('Error in postDLStep()'));
    }
}
