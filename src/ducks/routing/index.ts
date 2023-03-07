import {combineReducers} from "redux";
import {
    defaultDetailSort,
    defaultState,
    RoutingAction,
    RoutingDetailSorterProps,
    RoutingHeaderSorterProps,
    SelectedRoutingState
} from "./types";
import {OperationCodeAction} from "../operationCodes/types";
import {loadOCSucceeded} from "../operationCodes";
import {RoutingDetail, RoutingHeader, RoutingHeaderList} from "../types";
import {RootState} from "../../app/configureStore";

export * from './types';

export const loadListRequested = 'routing/loadListRequested';
export const loadListSucceeded = 'routing/loadListSucceeded';
export const loadListFailed = 'routing/loadListFailed';
export const routingSelected = 'routing/routingSelected';
export const loadRoutingRequested = 'routing/loadRoutingRequested';
export const loadRoutingSucceeded = 'routing/loadRoutingSucceeded';
export const loadRoutingFailed = 'routing/loadRoutingFailed';
export const filterChanged = 'routing/filterChanged';
export const filterActiveChanged = 'routing/filterActiveChanged';

export const routingHeaderKey = (header: RoutingHeader) => header.RoutingNo;
export const routingDetailKey = (detail: RoutingDetail) => [detail.RoutingNo, detail.StepNo].join(':');


export const routingHeaderSorter = ({field, ascending}: RoutingHeaderSorterProps) =>
    (a: RoutingHeader, b: RoutingHeader): number => {
        return (
            a[field] === b[field]
                ? (routingHeaderKey(a) > routingHeaderKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export const routingDetailSorter = ({field, ascending}: RoutingDetailSorterProps) =>
    (a: RoutingDetail, b: RoutingDetail): number => {
        return (
            a[field] === b[field]
                ? (routingDetailKey(a) > routingDetailKey(b) ? -1 : 1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };


export const listSelector = (sort: RoutingHeaderSorterProps) => (state: RootState): RoutingHeader[] => {
    return Object.values(state.routing.list).sort(routingHeaderSorter(sort));
}

export const filteredListSelector = (sort: RoutingHeaderSorterProps) => (state: RootState): RoutingHeader[] => {
    let filter: RegExp = /^/;
    try {
        filter = new RegExp(state.routing.filter, 'i');
    } catch (err) {
    }
    const filterActive = state.routing.filterActive;

    return Object.values(state.routing.list)
        .filter(row => !filterActive || (row.BillStatus && row.ItemStatus))
        .filter(row => filter.test(row.RoutingNo) || filter.test(row.StepDescription))
        .sort(routingHeaderSorter(sort));
}

export const loadingSelector = (state: RootState): boolean => state.routing.loading;
export const loadedSelector = (state: RootState): boolean => state.routing.loaded;
export const selectedSelector = (state: RootState): SelectedRoutingState => state.routing.selected;
export const routingHeaderSelector = (routingNo:string) => (state:RootState): RoutingHeader|null => {
    return state.routing.list[routingNo] || null;
}
export const selectedHeaderSelector = (state: RootState): RoutingHeader | null => state.routing.selected.header;

export const detailListSelector = (state:RootState):RoutingDetail[] => state.routing.detailList;

export const whereUsedDetailSelector = (keyList:string[]) => (state:RootState):RoutingDetail[] => {
    return state.routing.detailList.filter(rd => keyList.includes(routingDetailKey(rd)));
}
export const selectedDetailSelector = (sort: RoutingDetailSorterProps) =>
    (state: RootState): RoutingDetail[] => state.routing.selected.detail.sort(routingDetailSorter(sort));

export const selectedLoadingSelector = (state: RootState): boolean => state.routing.selected.loading;
export const filterSelector = (state: RootState): string => state.routing.filter;
export const filterActiveSelector = (state: RootState): boolean => state.routing.filterActive;

const listReducer = (state: RoutingHeaderList = defaultState.list, action: RoutingAction): RoutingHeaderList => {
    const {type, payload} = action;
    switch (type) {
    case loadListSucceeded:
        return payload?.list || {};
    default:
        return state;
    }
}

const detailListReducer = (state: RoutingDetail[] = defaultState.detailList, action: OperationCodeAction): RoutingDetail[] => {
    const {type, payload} = action;
    switch (type) {
    case loadOCSucceeded:
        if (payload?.routings) {
            const keys = payload.routings.map(rd => routingDetailKey(rd));
            return [
                ...state.filter(detail => !keys.includes(routingDetailKey(detail))),
                ...payload.routings,
            ].sort(routingDetailSorter(defaultDetailSort));
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = defaultState.loading, action: RoutingAction): boolean => {
    switch (action.type) {
    case loadListRequested:
        return true;
    case loadListSucceeded:
    case loadListFailed:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = defaultState.loading, action: RoutingAction): boolean => {
    switch (action.type) {
    case loadListSucceeded:
        return true;
    default:
        return state;
    }
}

const filterReducer = (state: string = defaultState.filter, action: RoutingAction): string => {
    const {type, payload} = action;
    switch (type) {
    case filterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const filterActiveReducer = (state: boolean = defaultState.filterActive, action: RoutingAction): boolean => {
    switch (action.type) {
    case filterActiveChanged:
        return !state;
    default:
        return state;
    }
}

const selectedHeaderReducer = (state: RoutingHeader | null = defaultState.selected.header, action: RoutingAction): RoutingHeader | null => {
    const {type, payload} = action;
    switch (type) {
    case routingSelected:
    case loadRoutingSucceeded:
        return payload?.routing?.header || null;
    default:
        return state;
    }
}

const selectedDetailReducer = (state: RoutingDetail[] = defaultState.selected.detail, action: RoutingAction): RoutingDetail[] => {
    const {type, payload} = action;
    switch (type) {
    case routingSelected:
        return [];
    case loadRoutingSucceeded:
        return (payload?.routing?.detail || []).sort(routingDetailSorter(defaultDetailSort));
    default:
        return state;
    }
}


const selectedLoadingReducer = (state: boolean = defaultState.selected.loading, action: RoutingAction): boolean => {
    switch (action.type) {
    case loadRoutingRequested:
        return true;
    case loadRoutingSucceeded:
    case loadRoutingFailed:
        return false;
    default:
        return state;
    }
}

const selectedReducer = combineReducers({
    header: selectedHeaderReducer,
    detail: selectedDetailReducer,
    loading: selectedLoadingReducer,
})

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    detailList: detailListReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
    filter: filterReducer,
    filterActive: filterActiveReducer,
});
