import {OperationCodeKey} from "chums-types";
import {fetchJSON} from "chums-components";
import {OperationCodeResponse} from "./types";

export async function fetchOperationCodes(): Promise<OperationCodeResponse> {
    try {
        const url = `/api/operations/production/wo/chums/operation-codes`;
        const res = await fetchJSON<OperationCodeResponse>(url, {cache: 'no-cache'});
        return {
            operationCodes: res?.operationCodes ?? [],
            accounts: res?.accounts ?? [],
            whereUsed: res?.whereUsed ?? [],
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOperationCodes()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOperationCodes()", err);
        return Promise.reject(new Error('Error in fetchOperationCodes()'));
    }
}

export async function fetchOperationCode(arg: OperationCodeKey): Promise<OperationCodeResponse> {
    try {
        const url = `/api/operations/production/wo/chums/operation-codes/:workCenter/:operationCode`
            .replace(':workCenter', encodeURIComponent(arg.WorkCenter))
            .replace(':operationCode', encodeURIComponent(arg.OperationCode));
        const res = await fetchJSON<OperationCodeResponse>(url, {cache: 'no-cache'});
        return {
            operationCodes: res?.operationCodes ?? [],
            accounts: res?.accounts ?? [],
            whereUsed: res?.whereUsed ?? [],
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOperationCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOperationCode()", err);
        return Promise.reject(new Error('Error in fetchOperationCode()'));
    }
}
