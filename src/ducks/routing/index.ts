import {combineReducers} from "redux";
import {
    BillHeader, BillHeaderSorterProps,
    defaultState,
    RoutingAction,
    RoutingDetail, RoutingDetailSorterProps,
    RoutingHeader, RoutingHeaderSorterProps,
    SelectedRoutingState
} from "./types";
import {RootState} from "../index";

export * from './types';

export const loadListRequested = 'routing/loadListRequested';
export const loadListSucceeded = 'routing/loadListSucceeded';
export const loadListFailed = 'routing/loadListFailed';
export const routingSelected = 'routing/routingSelected';
export const loadRoutingRequested = 'routing/loadRoutingRequested';
export const loadRoutingSucceeded = 'routing/loadRoutingSucceeded';
export const loadRoutingFailed = 'routing/loadRoutingFailed';
export const filterChanged = 'routing/filterChanged';

export const routingHeaderKey = (header:RoutingHeader) => header.RoutingNo;
export const routingDetailKey = (detail:RoutingDetail) => [detail.RoutingNumber, detail.StepNo].join(':');
export const billHeaderKey = (header:BillHeader) => [header.BillNo, header.Revision].join(':');


export const routingHeaderSorter = ({field, ascending}:RoutingHeaderSorterProps) =>
    (a:RoutingHeader, b:RoutingHeader):number => {
        return (
            a[field] === b[field]
            ? (routingHeaderKey(a) > routingHeaderKey(b) ? 1 : -1)
            : ((a[field]??'') === (b[field]??'') ? 0 :((a[field]??'') > (b[field]??'') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export const routingDetailSorter = ({field, ascending}:RoutingDetailSorterProps) =>
    (a:RoutingDetail, b:RoutingDetail):number => {
        return (
            a[field] === b[field]
            ? (routingDetailKey(a) > routingDetailKey(b) ? -1 : 1)
            : ((a[field]??'') === (b[field]??'') ? 0 :((a[field]??'') > (b[field]??'') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export const billHeaderSorter = ({field, ascending}:BillHeaderSorterProps) =>
    (a:BillHeader, b:BillHeader) => {
        return (
            a[field] === b[field]
            ? (billHeaderKey(a) > billHeaderKey(b) ? 1 : -1)
            : ((a[field]??'') === (b[field]??'') ? 0 :((a[field]??'') > (b[field]??'') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };

export const listSelector = (sort:RoutingHeaderSorterProps) => (state: RootState): RoutingHeader[] => {
    return state.routing.list.sort(routingHeaderSorter(sort));
}

export const filteredlistSelector = (sort:RoutingHeaderSorterProps) => (state: RootState): RoutingHeader[] => {
    let filter:RegExp = /^/;
    try {
        filter = new RegExp(state.routing.filter, 'i');
    } catch(err) {}

    return state.routing.list
        .filter(row => filter.test(row.RoutingNo) || filter.test(row.StepDescription))
        .sort(routingHeaderSorter(sort));
}

export const loadingSelector = (state: RootState): boolean => state.routing.loading;
export const loadedSelector = (state: RootState): boolean => state.routing.loaded;
export const selectedSelector = (state:RootState):SelectedRoutingState => state.routing.selected;
export const selectedHeaderSelector = (state:RootState):RoutingHeader|null => state.routing.selected.header;
export const selectedDetailSelector = (sort:RoutingDetailSorterProps) =>
    (state:RootState):RoutingDetail[] => state.routing.selected.detail.sort(routingDetailSorter(sort));
export const selectedWhereUsedSelector = (sort:BillHeaderSorterProps) =>
    (state:RootState):BillHeader[] => state.routing.selected.whereUsed.sort(billHeaderSorter(sort));
export const selectedLoadingSelector = (state:RootState):boolean => state.routing.selected.loading;
export const filterSelector = (state:RootState):string => state.routing.filter;

const listReducer = (state: RoutingHeader[] = defaultState.list, action: RoutingAction): RoutingHeader[] => {
    const {type, payload} = action;
    switch (type) {
    case loadListSucceeded:
        return payload?.list || [];
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
    default: return state;
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
        return payload?.routing?.detail || []
    default:
        return state;
    }
}
const selectedWhereUsedReducer = (state: BillHeader[] = defaultState.selected.whereUsed, action: RoutingAction): BillHeader[] => {
    const {type, payload} = action;
    switch (type) {
    case routingSelected:
        return [];
    case loadRoutingSucceeded:
        return payload?.routing?.whereUsed || [];
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
    whereUsed: selectedWhereUsedReducer,
    loading: selectedLoadingReducer,
})

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
    filter: filterReducer,
});
