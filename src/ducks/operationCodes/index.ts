import {combineReducers} from "redux";
import {
    defaultState,
    OperationCode,
    OperationCodeAction,
    operationCodeDefaultSort,
    operationCodeKey,
    operationCodeSorter,
    OperationCodeSorterProps
} from "./types";
import {RootState} from "../index";
import {defaultDetailSort, detailListSelector, routingDetailKey, routingDetailSorter} from "../routing";
import {createSelector} from "reselect";


export const loadOCListRequested = 'operationCodes/loadListRequested';
export const loadOCListSucceeded = 'operationCodes/loadListSucceeded';
export const loadOCListFailed = 'operationCodes/loadListFailed';
export const loadOCRequested = 'operationCodes/loadCodeRequested';
export const loadOCSucceeded = 'operationCodes/loadCodeSucceeded';
export const loadOCFailed = 'operationCodes/loadCodeFailed';
export const operationCodeSelected = 'operationCodes/codeSelected';
export const workCenterChanged = 'operationCodes/workCenterChanged';
export const searchChanged = 'operationCodes/searchChanged';

export const countRecordsSelector = (state: RootState) => state.operationCodes.list.length;

export const listSelector = (sort: OperationCodeSorterProps) => (state: RootState) => {
    const {filterWC, search, list} = state.operationCodes;
    let searchRegex = /^/;
    try {
        searchRegex = new RegExp(search, 'i');
    } catch (err) {
    }
    return list
        .filter(oc => !filterWC || oc.WorkCenter === filterWC)
        .filter(oc => searchRegex.test(oc.OperationCode) || searchRegex.test(oc.OperationDescription))
        .sort(operationCodeSorter(sort));
}

export const filterWorkCenterSelector = (state: RootState): string => state.operationCodes.filterWC;
export const searchSelector = (state: RootState): string => state.operationCodes.search;
export const searchRegexSelector = (state: RootState): RegExp => {
    try {
        return new RegExp(state.operationCodes.search, 'i');
    } catch (err) {
        return /^/;
    }
}

export const selectedOCSelector = (state: RootState): OperationCode | null => state.operationCodes.selected;
export const loadingSelector = (state: RootState): boolean => state.operationCodes.loading;
export const loadedSelector = (state: RootState): boolean => state.operationCodes.loaded;
export const whereUsedSelector = (state:RootState):string[] => state.operationCodes.whereUsed;

const listReducer = (state: OperationCode[] = defaultState.list, action: OperationCodeAction): OperationCode[] => {
    const {type, payload} = action;
    switch (type) {
    case loadOCListSucceeded:
        return (payload?.list || []).sort(operationCodeSorter(operationCodeDefaultSort));
    case loadOCSucceeded:
        if (payload?.selected) {
            const key = operationCodeKey(payload.selected)
            return [
                ...state.filter(oc => operationCodeKey(oc) !== key),
                {...payload.selected},
            ].sort(operationCodeSorter(operationCodeDefaultSort));
        }
        return state;
    default:
        return state;
    }
}

const selectedReducer = (state: OperationCode | null = defaultState.selected, action: OperationCodeAction): OperationCode | null => {
    const {type, payload} = action;
    switch (type) {
    case loadOCSucceeded:
    case operationCodeSelected:
        return payload?.selected || null;
    case loadOCListSucceeded:
        return null;
    default:
        return state;
    }
}

const whereUsedReducer = (state: string[] = defaultState.whereUsed, action: OperationCodeAction): string[] => {
    const {type, payload} = action;
    switch (type) {
    case loadOCRequested:
        return [];
    case loadOCSucceeded:
        if (payload?.routings) {
            return payload.routings.map(rd => routingDetailKey(rd)).sort();
        }
        return state;
    default:
        return state;
    }
}

const filterWCReducer = (state: string = defaultState.filterWC, action: OperationCodeAction): string => {
    const {type, payload} = action;
    switch (type) {
    case workCenterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const searchReducer = (state: string = defaultState.search, action: OperationCodeAction): string => {
    const {type, payload} = action;
    switch (type) {
    case searchChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = defaultState.loading, action: OperationCodeAction): boolean => {
    switch (action.type) {
    case loadOCListRequested:
    case loadOCRequested:
        return true;
    case loadOCListSucceeded:
    case loadOCListFailed:
    case loadOCSucceeded:
    case loadOCFailed:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = defaultState.loading, action: OperationCodeAction): boolean => {
    switch (action.type) {
    case loadOCListSucceeded:
        return true;
    case loadOCListFailed:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    whereUsed: whereUsedReducer,
    filterWC: filterWCReducer,
    search: searchReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
})
