import {combineReducers} from "redux";
import {DLTiming} from "../types";
import {stepSelected, stepsLoadStepSucceeded} from "../dlSteps/actionTypes";
import {newTiming, TimingsAction} from "./types";
import {
    changeTiming,
    editTiming,
    loadTimingEntriesFailed,
    loadTimingEntriesRequested,
    loadTimingEntriesSucceeded,
    saveTimingEntriesFailed,
    saveTimingEntriesRequested,
    saveTimingEntriesSucceeded,
    timingsSelectedChanged,
    timingsSelectTiming
} from "./actionTypes";


const listReducer = (state: DLTiming[] = [], action: TimingsAction): DLTiming[] => {
    const {type, payload} = action;
    switch (type) {
    case stepSelected:
        return [];
    case stepsLoadStepSucceeded:
        if (payload?.step && payload.step?.timings) {
            return [...payload.step.timings];
        }
        return state;
    case loadTimingEntriesSucceeded:
    case saveTimingEntriesSucceeded:
        if (payload?.timings) {
            return [...payload.timings];
        }
        return state;
    default:
        return state;
    }
}

const selectedTimingReducer = (state: DLTiming = newTiming, action: TimingsAction): DLTiming => {
    const {type, payload} = action;
    switch (type) {
    case timingsSelectTiming:
        if (payload?.timing) {
            return {...payload.timing};
        }
        return state;
    case loadTimingEntriesSucceeded:
        if (payload?.timings) {
            const [timing] = payload.timings.filter(t => t.id === state.id);
            if (timing) {
                return {...timing};
            }
        }
        return state;
    case editTiming:
        if (payload?.timing) {
            return {...payload.timing};
        }
        return {...newTiming};
    case changeTiming:
        if (payload?.change) {
            return {
                ...state,
                ...payload.change,
            };
        }
        return state;
    case stepSelected:
    case saveTimingEntriesSucceeded:
        return {...newTiming};
    default:
        return state;
    }
}

const selectedChangedReducer = (state: boolean = false, action: TimingsAction): boolean => {
    switch (action.type) {
    case timingsSelectedChanged:
        return true;
    case editTiming:
        if (action.payload?.change) {
            return true;
        }
        return state;
    case stepSelected:
    case stepsLoadStepSucceeded:
    case loadTimingEntriesSucceeded:
        return false;
    default:
        return state;
    }
}

const selectedLoadingReducer = (state: boolean = false, action: TimingsAction): boolean => {
    switch (action.type) {
    case loadTimingEntriesRequested:
        return true;
    case loadTimingEntriesFailed:
    case loadTimingEntriesSucceeded:
        return false;
    default:
        return state;
    }
}

const selectedSavingReducer = (state: boolean = false, action: TimingsAction): boolean => {
    switch (action.type) {
    case saveTimingEntriesRequested:
        return true;
    case saveTimingEntriesFailed:
    case saveTimingEntriesSucceeded:
        return false;
    default:
        return state;
    }
}

const editReducer = (state: boolean = false, action: TimingsAction): boolean => {
    switch (action.type) {
    case editTiming:
        return action.payload?.edit || false;
    case saveTimingEntriesSucceeded:
    case stepSelected:
        return false;
    default:
        return state;
    }
}

const selectedReducer = combineReducers({
    timing: selectedTimingReducer,
    changed: selectedChangedReducer,
    saving: selectedSavingReducer,
    loading: selectedLoadingReducer,
});

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    edit: editReducer,
});



