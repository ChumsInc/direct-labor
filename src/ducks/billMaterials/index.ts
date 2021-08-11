import {combineReducers} from "redux";
import {
    BillHeader, BillHeaderList,
    billHeaderSorter,
    BillHeaderSorterProps,
    BillOptionHeader, BillOptionHeaderList, billOptionHeaderSorter,
    BillOptionHeaderSorterProps,
    defaultState
} from "./types";
import {RootState} from "../index";
import {loadRoutingSucceeded, RoutingAction, routingSelected} from "../routing";


export const billHeaderSelector = (sort: BillHeaderSorterProps) =>
    (state: RootState): BillHeader[] => Object.values(state.billMaterials.headerList).sort(billHeaderSorter(sort));

export const billOptionHeaderSelector = (sort: BillOptionHeaderSorterProps) =>
    (state: RootState): BillOptionHeader[] => Object.values(state.billMaterials.headerOptionList).sort(billOptionHeaderSorter(sort));


const headerListReducer = (state: BillHeaderList = defaultState.headerList, action: RoutingAction): BillHeaderList => {
    const {type, payload} = action;
    switch (type) {
    case routingSelected:
        return {};
    case loadRoutingSucceeded:
        return payload?.routing?.whereUsed || {};
    default:
        return state;
    }
}

const headerOptionListReducer = (state: BillOptionHeaderList = defaultState.optionHeaderList,
                                           action: RoutingAction): BillOptionHeaderList => {
    const {type, payload} = action;
    switch (type) {
    case routingSelected:
        return {};
    case loadRoutingSucceeded:
        return payload?.routing?.whereUsedInOptions || {};
    default:
        return state;
    }
}

export default combineReducers({
    headerList: headerListReducer,
    headerOptionList: headerOptionListReducer,
})
