import {OperationCode} from "../ducks/types";
import {fetchJSON} from "chums-components";
import {OperationCodeResponse} from "../ducks/operationCodes/types";

export async function fetchOperationCodes(): Promise<OperationCodeResponse> {
    try {
        const url = `/api/operations/production/wo/chums/operation-codes`;
        return await fetchJSON<OperationCodeResponse>(url, {cache: 'no-cache'}) ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOperationCodes()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOperationCodes()", err);
        return Promise.reject(new Error('Error in fetchOperationCodes()'));
    }
}

export async function fetchOperationCode(arg: OperationCode): Promise<OperationCodeResponse> {
    try {
        const url = `/api/operations/production/wo/chums/operation-codes/:workCenter/:operationCode`
            .replace(':workCenter', encodeURIComponent(arg.WorkCenter))
            .replace(':operationCode', encodeURIComponent(arg.OperationCode));
        return await fetchJSON(url, {cache: 'no-cache'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOperationCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOperationCode()", err);
        return Promise.reject(new Error('Error in fetchOperationCode()'));
    }
}
