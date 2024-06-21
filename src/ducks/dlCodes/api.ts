import {DLCodeList} from "../types";
import {AddDLStepArg, DLCodeResponse} from "./types";
import {fetchJSON} from "chums-components";
import {dlCodeKey, dlCodeStepSorter} from "./utils";
import {DLCode, DLCodeStep} from "chums-types";

export async function deleteStep(arg:DLCodeStep):Promise<DLCodeResponse|null> {
    try {
        const url = `/api/operations/production/dl/codes/${encodeURIComponent(arg.dlCodeId)}/step/${encodeURIComponent(arg.stepId)}`;
        return await fetchJSON<DLCodeResponse>(url, {method: 'DELETE'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("deleteStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteStep()", err);
        return Promise.reject(new Error('Error in deleteStep()'));
    }
}

export async function postStepSort(id: number, steps:DLCodeStep[]):Promise<DLCodeResponse|null> {
    try {
        const url = `/api/operations/production/dl/codes/${encodeURIComponent(id)}/steps`;
        const body = JSON.stringify({
            steps: steps.sort(dlCodeStepSorter).map(step => step.id)
        });
        return await fetchJSON<DLCodeResponse>(url, {method: 'POST', body});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postStepSort()", err.message);
            return Promise.reject(err);
        }
        console.debug("postStepSort()", err);
        return Promise.reject(new Error('Error in postStepSort()'));
    }
}

export async function postAddStep(arg:AddDLStepArg):Promise<DLCodeResponse|null> {
    try {
        const url = `/api/operations/production/dl/codes/${encodeURIComponent(arg.id)}/step/${encodeURIComponent(arg.stepId)}`;
        return await fetchJSON<DLCodeResponse>(url, {method: 'POST'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postAddStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("postAddStep()", err);
        return Promise.reject(new Error('Error in postAddStep()'));
    }
}

export async function postDLCode(arg:DLCode):Promise<DLCodeResponse|null> {
    try {
        const url = `/api/operations/production/dl/codes/${encodeURIComponent(arg.id)}`;
        const body = JSON.stringify(arg);
        return await fetchJSON<DLCodeResponse>(url, {method: 'POST', body});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postDLCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("postDLCode()", err);
        return Promise.reject(new Error('Error in postDLCode()'));
    }
}

export async function fetchDLCode(arg:number|string):Promise<DLCodeResponse|null> {
    try {
        const url = `/api/operations/production/dl/codes/${encodeURIComponent(arg)}.json`;
        return await fetchJSON<DLCodeResponse>(url, {cache: 'no-cache'})
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLCode()", err);
        return Promise.reject(new Error('Error in fetchDLCode()'));
    }
}

export async function fetchDLCodeList():Promise<DLCodeList> {
    try {
        const url = `/api/operations/production/dl/codes.json`;
        const res = await fetchJSON<{dlCodes: DLCode[]}>(url, {cache: 'no-cache'})
        const list: DLCodeList = {};
        res?.dlCodes.forEach((row: DLCode) => list[dlCodeKey(row)] = row);
        return list;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLCodeList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLCodeList()", err);
        return Promise.reject(new Error('Error in fetchDLCodeList()'));
    }
}

export async function postRecalculateDLCode(arg:number):Promise<DLCodeResponse|null> {
    try {
        if (!arg) {
            return null;
        }
        const url = `/api/operations/production/dl/codes/recalc/${encodeURIComponent(arg)}`;
        return await fetchJSON<DLCodeResponse>(url, {method: 'POST'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postRecalculateDLCodes()", err.message);
            return Promise.reject(err);
        }
        console.debug("postRecalculateDLCodes()", err);
        return Promise.reject(new Error('Error in postRecalculateDLCodes()'));
    }
}

export async function postRecalculateDLCodes():Promise<DLCodeList> {
    try {
        const url = `/api/operations/production/dl/codes/recalc/`;
        const res = await fetchJSON<{dlCodes: DLCode[]}>(url, {method: 'POST'});
        const list: DLCodeList = {};
        res?.dlCodes.forEach((row: DLCode) => list[dlCodeKey(row)] = row);
        return list;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postRecalculateDLCodes()", err.message);
            return Promise.reject(err);
        }
        console.debug("postRecalculateDLCodes()", err);
        return Promise.reject(new Error('Error in postRecalculateDLCodes()'));
    }
}
