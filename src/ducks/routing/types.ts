import {ActionInterface, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {
    ActionInterfacePayload,
    BillHeaderList,
    BillOptionHeaderList,
    defaultListState,
    ListState,
    RoutingDetail,
    RoutingDetailField,
    RoutingHeader,
    RoutingHeaderField,
    RoutingHeaderList
} from "../types";


export interface RoutingPayload extends ActionInterfacePayload {
    list?: RoutingHeaderList,
    routing?: {
        header: RoutingHeader | null,
        detail?: RoutingDetail[],
        whereUsed?: BillHeaderList,
        whereUsedInOptions?: BillOptionHeaderList,
    },
}

export interface RoutingAction extends ActionInterface {
    payload?: RoutingPayload,
}

export interface RoutingThunkAction extends ThunkAction<any, RootState, unknown, RoutingAction> {
}

export interface SelectedRoutingState {
    header: RoutingHeader | null,
    detail: RoutingDetail[],
    loading: boolean,
}

export interface RoutingState extends ListState {
    list: RoutingHeaderList,
    selected: SelectedRoutingState,
    detailList: RoutingDetail[],
    filterActive: boolean,
}

export const defaultState: RoutingState = {
    ...defaultListState,
    list: {},
    selected: {
        header: null,
        detail: [],
        loading: false,
    },
    detailList: [],
    filterActive: true,
}


export interface RoutingHeaderSorterProps extends SorterProps {
    field: RoutingHeaderField
}

export interface RoutingDetailSorterProps extends SorterProps {
    field: RoutingDetailField
}

export const defaultHeaderSort: RoutingHeaderSorterProps = {field: "RoutingNo", ascending: true};
export const defaultDetailSort: RoutingDetailSorterProps = {field: "StepNo", ascending: true};

