import {combineReducers} from "redux";
import {RootState} from "../index";
import {
    WorkCenter,
    defaultState,
    WorkCenterAction,
    workCenterSorter,
    defaultWorkCenterSort,
    WorkCenterSorterProps
} from "./types";

export const loadWorkCentersRequested = 'workCenters/loadRequested';
export const loadWorkCentersSucceeded = 'workCenters/loadSucceeded';
export const loadWorkCentersFailed = 'workCenters/loadFailed';
export const saveWorkCenterRateRequested = 'workCenters/saveRateRequested';
export const saveWorkCenterRateSucceeded = 'workCenters/saveRateSucceeded';
export const saveWorkCenterRateFailed = 'workCenters/saveRateFailed';
export const workCenterSelected = 'workCenters/selected';
export const changeWorkCenter = 'workCenters/selectedChanged';


export const listSelector = (sort:WorkCenterSorterProps) => (state:RootState):WorkCenter[] => state.workCenters.list
    .sort(workCenterSorter(sort));
export const stdListSelector = (sort:WorkCenterSorterProps) => (state:RootState):WorkCenter[] => state.workCenters.list
    .filter(wc => wc.isStandardWC)
    .sort(workCenterSorter(sort));

export const nonStdListSelector = (sort:WorkCenterSorterProps) => (state:RootState):WorkCenter[] => state.workCenters.list
    .filter(wc => !wc.isStandardWC)
    .sort(workCenterSorter(sort));

export const loadingSelector = (state:RootState):boolean => state.workCenters.loading || state.workCenters.saving;
export const loadedSelector = (state:RootState):boolean => state.workCenters.loaded;
export const savingSelector = (state:RootState):boolean => state.workCenters.saving;
export const selectedWorkCenterSelector = (state:RootState):WorkCenter|null => state.workCenters.selected;
export const workCenterSelector = (workCenter?:string) => (state:RootState) => {
    if (!workCenter) {
        return null;
    }
    const [wc] = state.workCenters.list.filter(wc => wc.WorkCenterCode === workCenter);
    return wc || null;
}




const listReducer = (state:WorkCenter[] = defaultState.list, action:WorkCenterAction):WorkCenter[] => {
    const {type, payload} = action;
    switch (type) {
    case loadWorkCentersSucceeded:
        return (payload?.list || []).sort(workCenterSorter(defaultWorkCenterSort));
    case saveWorkCenterRateSucceeded:
        if (payload?.selected) {
            return [
                ...state.filter(wc => wc.WorkCenterCode !== payload.selected?.WorkCenterCode),
                payload.selected,
            ].sort(workCenterSorter(defaultWorkCenterSort));
        }
        return state;
    default:
        return state;
    }
}

const selectedReducer = (state:WorkCenter|null = defaultState.selected, action:WorkCenterAction):WorkCenter|null => {
    const {type, payload} = action;
    switch (type) {
    case workCenterSelected:
        return payload?.selected || null;
    case changeWorkCenter:
        if (state !== null) {
            return {...state, AverageHourlyRate: payload?.rate || 0, changed: true};
        }
        return state;
    case loadWorkCentersSucceeded:
        if (state !== null && payload?.list) {
            const [wc] = payload.list.filter(wc => wc.WorkCenterCode === state.WorkCenterCode);
            return wc || null;
        }
        return state;
    case saveWorkCenterRateSucceeded:
        return null;
    default:
        return state;
    }
}

const loadingReducer = (state:boolean = defaultState.loading, action:WorkCenterAction):boolean => {
    switch (action.type) {
    case loadWorkCentersRequested:
        return true;
    case loadWorkCentersSucceeded:
    case loadWorkCentersFailed:
        return false;
    default: return state;
    }
}

const savingReducer = (state:boolean = defaultState.loading, action:WorkCenterAction):boolean => {
    switch (action.type) {
    case saveWorkCenterRateRequested:
        return true;
    case saveWorkCenterRateSucceeded:
    case saveWorkCenterRateFailed:
        return false;
    default: return state;
    }
}

const loadedReducer = (state:boolean = defaultState.loading, action:WorkCenterAction):boolean => {
    switch (action.type) {
    case loadWorkCentersSucceeded:
        return true;
    case loadWorkCentersFailed:
        return false;
    default: return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
    saving: savingReducer,
})
