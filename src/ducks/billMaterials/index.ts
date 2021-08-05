import {combineReducers} from "redux";
import {
    BillHeader,
    billHeaderSorter,
    BillHeaderSorterProps,
    BillOptionHeader, billOptionHeaderSorter,
    BillOptionHeaderSorterProps,
    defaultState
} from "./types";
import {RootState} from "../index";
import {loadRoutingSucceeded, RoutingAction, routingSelected} from "../routing";


export const billHeaderSelector = (sort: BillHeaderSorterProps) =>
    (state: RootState): BillHeader[] => state.billMaterials.headerList.sort(billHeaderSorter(sort));

export const billOptionHeaderSelector = (sort: BillOptionHeaderSorterProps) =>
    (state: RootState): BillOptionHeader[] => state.billMaterials.headerOptionList.sort(billOptionHeaderSorter(sort));


const headerListReducer = (state: BillHeader[] = defaultState.headerList, action: RoutingAction): BillHeader[] => {
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

const headerOptionListReducer = (state: BillOptionHeader[] = defaultState.optionHeaderList,
                                           action: RoutingAction): BillOptionHeader[] => {
    const {type, payload} = action;
    switch (type) {
    case routingSelected:
        return [];
    case loadRoutingSucceeded:
        return payload?.routing?.whereUsedInOptions || [];
    default:
        return state;
    }
}

export default combineReducers({
    headerList: headerListReducer,
    headerOptionList: headerOptionListReducer,
})
