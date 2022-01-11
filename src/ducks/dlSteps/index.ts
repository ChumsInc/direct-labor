import {combineReducers} from "redux";
import {DLCode, DLStep, DLSteps} from "../types";
import {defaultState, DLStepsAction} from "./types";
import {applyTimingSucceeded, saveTimingEntriesSucceeded} from "../timings/actionTypes";
import {
    filterChanged,
    filterInactiveChanged,
    stepChanged,
    stepSelected,
    stepsLoadListFailed,
    stepsLoadListRequested,
    stepsLoadListSucceeded,
    stepsLoadStepFailed,
    stepsLoadStepRequested,
    stepsLoadStepSucceeded,
    stepsSaveFailed,
    stepsSaveRequested,
    stepsSaveSucceeded,
    stepTimingChanged,
    wcFilterChanged
} from "./actionTypes";
import {defaultDLCodeSort, DLCodesAction, dlCodeSorter} from "../dlCodes/types";


const listReducer = (state: DLSteps = defaultState.list, action: DLStepsAction): DLSteps => {
    const {type, payload} = action;
    switch (type) {
    case stepsLoadListSucceeded:
        if (payload?.list) {
            return payload.list;
        }
        return state;
    case saveTimingEntriesSucceeded:
    case applyTimingSucceeded:
        if (payload?.step) {
            return {
                ...state,
                [payload.step.id]: payload.step
            }
        }
        return state;
    default:
        return state;
    }
}

const whereUsedReducer = (state: DLCode[] = defaultState.whereUsed, action: DLStepsAction): DLCode[] => {
    const {type, payload} = action;
    switch (type) {
    case stepSelected:
        return [];
    case stepsLoadStepSucceeded:
        if (payload?.codes) {
            return payload.codes.sort(dlCodeSorter(defaultDLCodeSort));
        }
        return state;
    default:
        return state;
    }
}

const machinesReducer = (state: string[] = defaultState.machines, action: DLStepsAction): string[] => {
    const {type, payload} = action;
    switch (type) {
    case stepsLoadListSucceeded:
        if (payload?.machines) {
            return payload.machines;
        }
        return state;
    default:
        return state;
    }
}

const selectedStepReducer = (state: DLStep = defaultState.selected.step, action: DLStepsAction): DLStep => {
    const {type, payload} = action;
    switch (type) {
    case stepSelected:
        if (payload?.basicStep) {
            return {
                ...payload.basicStep,
                instructions: '',
                notes: '',
                timestamp: '',
                idCurrentTiming: null,
                averageHourlyRate: 0,
                laborCost: 0,
                timings: [],
            }
        }
        return state;
    case stepsLoadStepSucceeded:
    case applyTimingSucceeded:
        if (payload?.step) {
            return {
                ...payload.step
            }
        }
        return state;
    case stepChanged:
        if (payload?.change) {
            return {
                ...state,
                ...payload.change,
            }
        }
        return state;
    case stepTimingChanged:
        if (payload?.timing) {
            const laborCost = state.averageHourlyRate / 60 * payload.timing.standardAllowedMinutes;
            return {
                ...state,
                idCurrentTiming: payload.timing.id,
                standardAllowedMinutes: payload.timing.standardAllowedMinutes,
                laborCost: laborCost,
                stepCost: state.fixedCosts + laborCost,
            }
        }
        return state;
    case saveTimingEntriesSucceeded:
        if (payload?.step) {
            return {
                ...payload.step,
            }
        }
        return state;
    default:
        return state;
    }
}

const selectedLoadingReducer = (state: boolean = defaultState.selected.loading, action: DLStepsAction): boolean => {
    switch (action.type) {
    case stepsLoadStepRequested:
        return true;
    case stepsLoadStepFailed:
    case stepsLoadStepSucceeded:
        return false;
    default:
        return state;
    }
}

const selectedSavingReducer = (state: boolean = defaultState.selected.saving, action: DLStepsAction): boolean => {
    switch (action.type) {
    case stepsSaveRequested:
        return true;
    case stepsSaveFailed:
    case stepsSaveSucceeded:
        return false;
    default:
        return state;
    }
}

const selectedChangedReducer = (state: boolean = defaultState.selected.changed, action: DLStepsAction): boolean => {
    switch (action.type) {
    case stepsSaveSucceeded:
    case stepSelected:
    case stepsLoadStepSucceeded:
        return false;
    case stepChanged:
    case stepTimingChanged:
        return true;
    default:
        return state;
    }
}

const selectedReducer = combineReducers({
    step: selectedStepReducer,
    loading: selectedLoadingReducer,
    saving: selectedSavingReducer,
    changed: selectedChangedReducer,
})

const loadingReducer = (state: boolean = defaultState.loading, action: DLStepsAction): boolean => {
    switch (action.type) {
    case stepsLoadListRequested:
        return true;
    case stepsLoadListSucceeded:
    case stepsLoadListFailed:
        return false
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = defaultState.loaded, action: DLStepsAction): boolean => {
    switch (action.type) {
    case stepsLoadListSucceeded:
        return true;
    default:
        return state;
    }
}

const filterReducer = (state: string = defaultState.filter, action: DLCodesAction): string => {
    const {type, payload} = action;
    switch (type) {
    case filterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const workCenterFilterReducer = (state: string = defaultState.filter, action: DLCodesAction): string => {
    const {type, payload} = action;
    switch (type) {
    case wcFilterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const filterInactiveReducer = (state: boolean = defaultState.filterInactive, action: DLStepsAction): boolean => {
    switch (action.type) {
    case filterInactiveChanged:
        return !state;
    default:
        return state;
    }
}


export default combineReducers({
    list: listReducer,
    whereUsed: whereUsedReducer,
    machines: machinesReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
    filter: filterReducer,
    wcFilter: workCenterFilterReducer,
    filterInactive: filterInactiveReducer,
})
