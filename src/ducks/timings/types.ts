import {ActionInterfacePayload, DLStep, DLTiming} from "../types";
import {ActionInterface} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../app/configureStore";

export interface TimingsActionPayload extends ActionInterfacePayload {
    timings?: DLTiming[],
    timing?: DLTiming,
    step?: DLStep,
    change?: object,
    edit?: boolean,
}

export interface TimingsAction extends ActionInterface {
    payload?: TimingsActionPayload,
}
export interface TimingsThunkAction extends ThunkAction<any, RootState, unknown, ActionInterface> {}

export const newTiming:DLTiming = {
    id: 0,
    idSteps: 0,
    timingDate: '',
    standardAllowedMinutes: 0,
    avgTiming: 0,
    quantityPerTiming: 1,
    efficiency: 1,
    notes: '',
    entries: [],
    timestamp: '',
};


export const dlStepTimingSorter = (a: DLTiming, b: DLTiming): number => {
    return (new Date(a.timingDate).valueOf() - new Date(b.timingDate).valueOf() || (a.id > b.id ? 1 : -1)) * -1;
};
