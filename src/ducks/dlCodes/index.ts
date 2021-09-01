import {combineReducers} from "redux";
import {defaultState, DLCodesAction} from "./types";
import {DLCode, DLCodeList, DLCodeSteps} from "../types";
import {
    dlCodeChanged,
    dlCodeSelected,
    dlCodeStepDeleted,
    filterChanged,
    loadDLCodeFailed,
    loadDLCodeRequested,
    loadDLCodesFailed,
    loadDLCodesRequested,
    loadDLCodesSucceeded,
    loadDLCodeSucceeded,
    saveDLCodeFailed,
    saveDLCodeRequested,
    saveDLCodeSucceeded,
    sortDLStepSucceeded,
    stepAddSucceeded,
    wcFilterChanged
} from "./actionTypes";


const listReducer = (state: DLCodeList = defaultState.list, action: DLCodesAction): DLCodeList => {
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
    default:
        return state;
    }
}

const selectedHeaderReducer = (state: DLCode = defaultState.selected.header, action: DLCodesAction): DLCode => {
    const {type, payload} = action;
    switch (type) {
    case loadDLCodeSucceeded:
    case saveDLCodeSucceeded:
    case stepAddSucceeded:
    case sortDLStepSucceeded:
    case dlCodeSelected:
        if (payload?.header) {
            return {...payload.header};
        }
        return state;
    case dlCodeChanged:
        if (payload?.change) {
            return {...state, ...payload.change, changed: true};
        }
        return state;
    default:
        return state;
    }
}

const selectedStepsReducer = (state: DLCodeSteps = defaultState.selected.steps, action: DLCodesAction): DLCodeSteps => {
    const {type, payload} = action;
    switch (type) {
    case loadDLCodeSucceeded:
    case saveDLCodeSucceeded:
    case stepAddSucceeded:
    case sortDLStepSucceeded:
    case dlCodeSelected:
        if (payload?.steps) {
            return {...payload.steps};
        }
        return state;
    case dlCodeStepDeleted:
        if (payload?.id) {
            const newState = {...state};
            delete newState[payload.id];
            return {...newState};
        }
        return state;
    default:
        return state;
    }
}

const selectedSavingReducer = (state: boolean = false, action: DLCodesAction): boolean => {
    switch (action.type) {
    case saveDLCodeRequested:
        return true;
    case saveDLCodeSucceeded:
    case saveDLCodeFailed:
        return false;
    default:
        return state;
    }
}

const selectedLoadingReducer = (state: boolean = false, action: DLCodesAction): boolean => {
    switch (action.type) {
    case loadDLCodeRequested:
        return true;
    case loadDLCodeFailed:
    case loadDLCodeSucceeded:
        return false;
    default:
        return state;
    }
}

const selectedChangedReducer = (state: boolean = false, action: DLCodesAction): boolean => {
    switch (action.type) {
    case dlCodeChanged:
    case dlCodeStepDeleted:
        return true;
    case loadDLCodeSucceeded:
    case loadDLCodesSucceeded:
    case saveDLCodeSucceeded:
        return false;
    default:
        return state;
    }
}

const selectedReducer = combineReducers({
    header: selectedHeaderReducer,
    steps: selectedStepsReducer,
    loading: selectedLoadingReducer,
    saving: selectedSavingReducer,
    changed: selectedChangedReducer,
})

const loadingReducer = (state: boolean = defaultState.loading, action: DLCodesAction): boolean => {
    switch (action.type) {
    case loadDLCodesRequested:
        return true;
    case loadDLCodesSucceeded:
    case loadDLCodesFailed:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = defaultState.loaded, action: DLCodesAction): boolean => {
    switch (action.type) {
    case loadDLCodesSucceeded:
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

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
    filter: filterReducer,
    wcFilter: workCenterFilterReducer,
})
