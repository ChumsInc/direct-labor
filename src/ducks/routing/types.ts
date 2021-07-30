import {ActionInterface, SortableTableField, SorterProps} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

export interface RoutingHeader {
    RoutingNo: string,
    StepDescription: string,
    StandardRateTotal: number,
}

export interface RoutingDetail {
    RoutingNumber: string,
    StepNo: string,
    StepDescription: string,
    WorkCenter: string,
    OperationCode: string,
    ParentQtyFactor: number,
    OperationDescription: string,
    StdRatePiece: number,
    PlannedPieceCostDivisor: number,
}

export type BillType = 'S'|'K'|'I'|'P'|'E'|'M';

export type BillTypeDescriptions = {
    [key in BillType]: string;
};
export const BillTypeDesc:BillTypeDescriptions = {
    S: 'Standard',
    K: 'Kit',
    I: 'Inactive',
    P: 'Phantom',
    E: 'Engineering',
    M: 'MRP',
}

export interface BillHeader {
    BillNo: string,
    Revision: string,
    BillType: BillType,
    BillDesc1: string,
    BillDesc2: string,
    DateLastUsed: string,
    RoutingNo: string,
    BillHasOptions: 'Y'|'N',
    DateUpdated: string,
    updatedByUser: string,
}


export interface RoutingAction extends ActionInterface {
    payload?: {
        list?: RoutingHeader[],
        routing?: {
            header: RoutingHeader,
            detail?: RoutingDetail[],
            whereUsed?: BillHeader[],
        },
        filter?: string,
        error?: Error,
        context?: string,
    }
}

export interface RoutingThunkAction extends ThunkAction<any, RootState, unknown, RoutingAction> {
}

export interface SelectedRoutingState {
    header: RoutingHeader | null,
    detail: RoutingDetail[],
    whereUsed: BillHeader[],
    loading: boolean,
}

export interface RoutingState {
    list: RoutingHeader[],
    selected: SelectedRoutingState,
    loading: boolean,
    loaded: boolean,
    filter: string,
}

export const defaultState: RoutingState = {
    list: [],
    selected: {
        header: null,
        detail: [],
        whereUsed: [],
        loading: false,
    },
    loading: false,
    loaded: false,
    filter: '',
}

export type RoutingHeaderField = keyof RoutingHeader;
export type RoutingDetailField = keyof RoutingDetail;
export type BillHeaderField = keyof BillHeader;

export interface RoutingHeaderSorterProps extends SorterProps {
    field: RoutingHeaderField
}
export interface RoutingDetailSorterProps extends SorterProps {
    field: RoutingDetailField
}
export interface BillHeaderSorterProps extends SorterProps {
    field: BillHeaderField
}

export const defaultHeaderSort: RoutingHeaderSorterProps = {field: "RoutingNo", ascending: true};
export const defaultDetailSort: RoutingDetailSorterProps = {field: "StepNo", ascending: true};
export const defaultBillSort: BillHeaderSorterProps = {field: "BillNo", ascending: true};

export interface RoutingDetailTableField extends SortableTableField {
    field: RoutingDetailField,
}
