import {DLTiming} from "../ducks/types";
import {fetchPOST} from "chums-ducks";
import {fetchJSON} from "chums-components";


const timingsURL = (id: number, idTimings?: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}/timings/${encodeURIComponent(idTimings || '')}`;
const applyTimingsURL = (id: number, idTiming: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}/timing/${encodeURIComponent(idTiming)}`;

export async function postTiming(arg:DLTiming):Promise<unknown> {
    try {
        const url = timingsURL(arg.idSteps, arg.id);
        const method = !!arg.idSteps ? 'PUT' : 'POST';
        const {timings, step} = await fetchJSON(url, {method, body: JSON.stringify(arg)});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postTiming()", err.message);
            return Promise.reject(err);
        }
        console.debug("postTiming()", err);
        return Promise.reject(new Error('Error in postTiming()'));
    }
}
