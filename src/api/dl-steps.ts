import {fetchJSON} from "chums-components";
import {DLStep} from "chums-types";
import {DLStepResponse, DLStepsResponse, newDLStep} from "../ducks/dlSteps/types";
import {DLSteps} from "../ducks/types";

const listURL = `/api/operations/production/dl/steps`;
const stepURL = (id: number) => `/api/operations/production/dl/steps/${encodeURIComponent(id)}`;

export async function fetchDLSteps(): Promise<DLStepsResponse> {
    try {
        const {steps, machines} = await fetchJSON<{
            steps: DLStep[],
            machines: string[]
        }>(listURL, {cache: 'no-cache'});
        const list: DLSteps = {};
        steps.forEach((step: DLStep) => {
            list[step.id] = step;
        })
        return {list, machines};
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLSteps()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLSteps()", err);
        return Promise.reject(new Error('Error in fetchDLSteps()'));
    }
}


export async function fetchDLStep(arg: number): Promise<DLStepResponse> {
    try {
        if (!arg) {
            return {step: {...newDLStep}, whereUsed: []};
        }
        const url = stepURL(arg)
        return await fetchJSON<DLStepResponse>(url, {cache: 'no-cache'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchDLStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchDLStep()", err);
        return Promise.reject(new Error('Error in fetchDLStep()'));
    }
}

export async function postDLStep(arg: DLStep): Promise<DLStepResponse> {
    try {
        const url = stepURL(arg.id);
        return await fetchJSON<DLStepResponse>(url, {body: JSON.stringify(arg)});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postDLStep()", err.message);
            return Promise.reject(err);
        }
        console.debug("postDLStep()", err);
        return Promise.reject(new Error('Error in postDLStep()'));
    }
}
