import type {AddDLStepArg, DLCodeResponse} from "./types";
import {fetchJSON} from "@chumsinc/ui-utils";
import {dlCodeStepSorter} from "./utils";
import type {DLCode, DLCodeStep} from "chums-types";

export async function deleteStep(arg: DLCodeStep): Promise<DLCodeResponse | null> {
    try {
        const url = `/api/operations/production/dl/codes/:id/step/:stepId.json`
            .replace(':id', encodeURIComponent(arg.dlCodeId))
            .replace(':stepId', encodeURIComponent(arg.stepId));
        return await fetchJSON<DLCodeResponse>(url, {method: 'DELETE'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteStep()", err);
        return Promise.reject(new Error('Error in deleteStep()'));
    }
}

export async function postStepSort(id: number, steps: DLCodeStep[]): Promise<DLCodeResponse | null> {
    try {
        const url = `/api/operations/production/dl/codes/:id/steps/sort.json`
            .replace(':id', encodeURIComponent(id))
        const body = JSON.stringify({
            steps: steps.sort(dlCodeStepSorter).map(step => step.id)
        });
        return await fetchJSON<DLCodeResponse>(url, {method: 'POST', body});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postStepSort()", err.message);
            return Promise.reject(err);
        }
        console.debug("postStepSort()", err);
        return Promise.reject(new Error('Error in postStepSort()'));
    }
}

export async function postAddStep(arg: AddDLStepArg): Promise<DLCodeResponse | null> {
    try {
        const url = `/api/operations/production/dl/codes/:id/step/:stepId.json`
            .replace(':id', encodeURIComponent(arg.id))
            .replace(':stepId', encodeURIComponent(arg.stepId));
        return await fetchJSON<DLCodeResponse>(url, {method: 'POST'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postAddStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("postAddStep()", err);
        return Promise.reject(new Error('Error in postAddStep()'));
    }
}

export async function postDLCode(arg: DLCode): Promise<DLCodeResponse | null> {
    try {
        const url = `/api/operations/production/dl/codes/:id.json`
            .replace(':id', encodeURIComponent(arg.id ? arg.id.toString() : '0'));
        const body = JSON.stringify(arg);
        return await fetchJSON<DLCodeResponse>(url, {method: 'POST', body});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postDLCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("postDLCode()", err);
        return Promise.reject(new Error('Error in postDLCode()'));
    }
}

export async function fetchDLCode(arg: number | string): Promise<DLCodeResponse | null> {
    try {
        const url = `/api/operations/production/dl/codes/:id.json`
            .replace(':id', encodeURIComponent(arg));
        return await fetchJSON<DLCodeResponse>(url, {cache: 'no-cache'})
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLCode()", err);
        return Promise.reject(new Error('Error in fetchDLCode()'));
    }
}

export async function fetchDLCodeList(): Promise<DLCode[]> {
    try {
        const url = `/api/operations/production/dl/codes.json`;
        const res = await fetchJSON<{ dlCodes: DLCode[] }>(url, {cache: 'no-cache'})
        return res?.dlCodes ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLCodeList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLCodeList()", err);
        return Promise.reject(new Error('Error in fetchDLCodeList()'));
    }
}

export async function postRecalculateDLCode(arg: number): Promise<DLCodeResponse | null> {
    try {
        if (!arg) {
            return null;
        }
        const url = `/api/operations/production/dl/codes/:id/recalc.json`
            .replace(':id', encodeURIComponent(encodeURIComponent(arg)));
        return await fetchJSON<DLCodeResponse>(url, {method: 'POST'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postRecalculateDLCodes()", err.message);
            return Promise.reject(err);
        }
        console.debug("postRecalculateDLCodes()", err);
        return Promise.reject(new Error('Error in postRecalculateDLCodes()'));
    }
}

export async function postRecalculateDLCodes(): Promise<DLCode[]> {
    try {
        const url = `/api/operations/production/dl/codes/recalc.json`;
        const res = await fetchJSON<{ dlCodes: DLCode[] }>(url, {method: 'POST'});
        return res?.dlCodes ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postRecalculateDLCodes()", err.message);
            return Promise.reject(err);
        }
        console.debug("postRecalculateDLCodes()", err);
        return Promise.reject(new Error('Error in postRecalculateDLCodes()'));
    }
}

export async function deleteDLCode(arg: number | string): Promise<DLCodeResponse | null> {
    try {
        const url = '/api/operations/production/dl/codes/:id.json'
            .replace(':id', encodeURIComponent(arg))
        return await fetchJSON<DLCodeResponse>(url, {method: 'DELETE'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteDLCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteDLCode()", err);
        return Promise.reject(new Error('Error in deleteDLCode()'));
    }
}
