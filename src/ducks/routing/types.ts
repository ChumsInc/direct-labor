import {ActionInterface, SortableTableField, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {BillHeader, BillOptionHeader} from "../billMaterials/types";
import {ReactElement} from "react";
import {ActionInterfacePayload, defaultListState, ListState} from "../types";

export interface RoutingHeader {
    RoutingNo: string,
    StepDescription: string,
    StandardRateTotal: number,
    BillStatus: boolean,
    ItemStatus: boolean,
}

export interface RoutingDetail {
    RoutingNo: string,
    StepNo: string,
    StepDescription: string,
    WorkCenter: string,
    OperationCode: string,
    ParentQtyFactor: number,
    OperationDescription: string,
    StdRatePiece: number,
    PlannedPieceCostDivisor: number,
}

export interface RoutingPayload extends ActionInterfacePayload {
    list?: RoutingHeader[],
    routing?: {
        header: RoutingHeader|null,
        detail?: RoutingDetail[],
        whereUsed?: BillHeader[],
        whereUsedInOptions?: BillOptionHeader[],
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
    list: RoutingHeader[],
    selected: SelectedRoutingState,
    detailList: RoutingDetail[],
    filterActive: boolean,
}

export const defaultState: RoutingState = {
    ...defaultListState,
    selected: {
        header: null,
        detail: [],
        loading: false,
    },
    detailList: [],
    filterActive: true,
}

export type RoutingHeaderField = keyof RoutingHeader;
export type RoutingDetailField = keyof RoutingDetail;

export interface RoutingHeaderSorterProps extends SorterProps {
    field: RoutingHeaderField
}
export interface RoutingDetailSorterProps extends SorterProps {
    field: RoutingDetailField
}

export const defaultHeaderSort: RoutingHeaderSorterProps = {field: "RoutingNo", ascending: true};
export const defaultDetailSort: RoutingDetailSorterProps = {field: "StepNo", ascending: true};

export interface RoutingHeaderTableField extends SortableTableField {
    field: RoutingHeaderField,
    render?: (row:RoutingHeader) => ReactElement|Element|string,
}
export interface RoutingDetailTableField extends SortableTableField {
    field: RoutingDetailField,
}
