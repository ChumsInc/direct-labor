import {
    ActionInterfacePayload,
    DLBasicStep,
    DLCode,
    DLStep,
    DLSteps,
    DLStepSorterProps,
    DLTiming,
    ListState
} from "../types";
import {ActionInterface} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {filterInactiveStepsKey, getPreference} from "../../utils/preferences";

export const newDLStep: DLStep = {
    id: 0,
    stepCode: '',
    description: '',
    workCenter: '',
    machine: '',
    active: true,
    standardAllowedMinutes: 0,
    fixedCosts: 0,
    stepCost: 0,
    notes: '',
    instructions: '',
    idCurrentTiming: null,
    averageHourlyRate: 0,
    laborCost: 0,
    timings: [],
    timestamp: ''
}

export interface DLStepsState extends ListState {
    list: DLSteps,
    whereUsed: DLCode[],
    machines: string[],
    selected: {
        step: DLStep,
        loading: boolean,
        saving: boolean,
        changed: boolean,
    },
}

export const defaultState: DLStepsState = {
    list: {},
    whereUsed: [],
    machines: [],
    selected: {
        step: newDLStep,
        loading: false,
        saving: false,
        changed: false,
    },
    loading: false,
    loaded: false,
    filter: '',
    wcFilter: '',
    filterInactive: getPreference(filterInactiveStepsKey, true),
}

export interface DLStepsActionPayload extends ActionInterfacePayload {
    list?: DLSteps,
    basicStep?: DLBasicStep,
    step?: DLStep,
    codes?: DLCode[],
    machines?: string[],
    change?: object,
    timing?: DLTiming,
}

export interface DLStepsAction extends ActionInterface {
    payload?: DLStepsActionPayload,
}

export interface DLStepsThunkAction extends ThunkAction<any, RootState, unknown, DLStepsAction> {
}


export const dlStepsDefaultSort: DLStepSorterProps = {
    field: 'id',
    ascending: true,
}


export const dlStepKey = (dl: DLStep | DLBasicStep) => dl.id;

export const dlStepSorter = ({field, ascending}: DLStepSorterProps) =>
    (a: DLStep, b: DLStep): number => {
        return (
            a[field] === b[field]
                ? (dlStepKey(a) > dlStepKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export const dlStepTimingSorter = (a: DLTiming, b: DLTiming): number => {
    return (new Date(a.timingDate).valueOf() - new Date(b.timingDate).valueOf() || (a.id > b.id ? 1 : -1)) * -1;
};
