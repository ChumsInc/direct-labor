import {combineReducers} from "redux";
import {
    defaultDLCodeSort,
    defaultState,
    DLCode, DLCodeList,
    DLCodesAction,
    dlCodeSorter, DLCodeSorterProps, DLCodeStep, DLCodeSteps,
    dlCodeStepSorter,
    SelectedDLCodeState
} from "./types";
import {RootState} from "../index";

export const loadDLCodesRequested = 'dlCodes/loadListRequested';
export const loadDLCodesSucceeded = 'dlCodes/loadListSucceeded';
export const loadDLCodesFailed = 'dlCodes/loadListFailed';
export const dlCodeSelected = 'dlCodes/codeSelected';
export const loadDLCodeRequested = 'dlCodes/loadRequested';
export const loadDLCodeSucceeded = 'dlCodes/loadSucceeded';
export const loadDLCodeFailed = 'dlCodes/loadFailed';
export const stepAddRequested = 'dlCodes/stepAddRequested';
export const stepAddSucceeded = 'dlCodes/stepAddSucceeded';
export const stepAddFailed = 'dlCodes/stepAddFailed';
export const saveDLCodeRequested = 'dlCodes/saveRequested';
export const saveDLCodeSucceeded = 'dlCodes/saveSucceeded';
export const saveDLCodeFailed = 'dlCodes/saveFailed';
export const sortDLStepRequested = 'dlCodes/sortRequested';
export const sortDLStepSucceeded = 'dlCodes/sortSucceeded';
export const sortDLStepFailed = 'dlCodes/sortFailed';
export const dlCodesFilterChanged = 'dlCodes/filterChanged';


export const listSelector = (sort:DLCodeSorterProps) => (state:RootState):DLCode[] => {
    let re = /^/;
    try {
        re = new RegExp(state.dlCodes.filter, 'i');
    } catch(err) {}

    return Object.values(state.dlCodes.list)
        .filter(dl => re.test(dl.dlCode) || re.test(dl.description))
        .sort(dlCodeSorter(sort));
}

export const listLengthSelector = (state:RootState):number => Object.keys(state.dlCodes.list).length;
export const dlCodeSelector = (id:number) => (state:RootState):DLCode|null => state.dlCodes.list[id] || null;
export const loadingSelector = (state:RootState):boolean => state.dlCodes.loading;
export const loadedSelector = (state:RootState):boolean => state.dlCodes.loaded;
export const selectedHeaderSelector = (state:RootState):DLCode|null => state.dlCodes.selected.header;
export const selectedStepsSelector = (state:RootState):DLCodeStep[] => {
    const {steps} = state.dlCodes.selected;
    return Object.keys(steps).sort().map(key => steps[Number(key)]);
}
export const selectedLoadingSelector = (state:RootState):boolean => state.dlCodes.selected.loading;
export const selectedSavingSelector = (state:RootState):boolean => state.dlCodes.selected.saving;

const listReducer = (state:DLCodeList = defaultState.list, action:DLCodesAction):DLCodeList => {
    const {type, payload} = action;
    switch (type) {
    case loadDLCodesSucceeded:

        return payload?.list || {};
    case saveDLCodeSucceeded:
    case stepAddSucceeded:
    case loadDLCodeSucceeded:
        if (payload?.header) {
            const dlCode = payload.header;
            return {
                ...state,
                [dlCode.id]: dlCode,
            }
        }
        return state;
    default: return state;
    }
}

const selectedReducer = (state:SelectedDLCodeState = defaultState.selected, action:DLCodesAction):SelectedDLCodeState => {
    const {type} = action;
    const {header = null, steps = {}} = action?.payload || {};
    switch (type) {
    case dlCodeSelected:
        return {header: header, steps: {}, loading: false, saving: false};
    case loadDLCodeRequested:
        return {...state, steps: {}, loading: true};
    case loadDLCodeFailed:
        return {...state, loading: false};
    case loadDLCodeSucceeded:
    case saveDLCodeSucceeded:
    case stepAddSucceeded:
    case sortDLStepSucceeded:
        return {header, steps, loading: false, saving: false};
    case saveDLCodeRequested:
    case sortDLStepRequested:
    case stepAddRequested:
        return {...state, saving: true};
    case saveDLCodeFailed:
    case sortDLStepFailed:
    case stepAddFailed:
        return {...state, saving: false};
    default: return state;
    }
}

const loadingReducer = (state:boolean = defaultState.loading, action:DLCodesAction):boolean => {
    switch (action.type) {
    case loadDLCodesRequested:
        return true;
    case loadDLCodesSucceeded:
    case loadDLCodesFailed:
        return false;
    default: return state;
    }
}

const loadedReducer = (state:boolean = defaultState.loaded, action:DLCodesAction):boolean => {
    switch (action.type) {
    case loadDLCodesSucceeded:
        return true;
    default: return state;
    }
}

const filterReducer = (state:string = defaultState.filter, action: DLCodesAction):string => {
    const {type, payload} = action;
    switch (type) {
    case dlCodesFilterChanged:
        return payload?.filter || '';
    default: return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
    filter: filterReducer,
})
