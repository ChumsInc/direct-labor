import {SortableTableField} from "chums-components";
import {BillType, DLBasicStep, DLCode, DLCodeStep, DLStep, StepTiming} from "chums-types";
import {BillHeader, BillOptionHeader} from "chums-types/src/bill-materials";
import {GLAccount} from "chums-types/src/general-ledger";
import {OperationCode, RoutingDetail, RoutingHeader, WorkCenter} from "chums-types/src/work-order";

export interface ListState {
    list: any[] | object,
    selected: any,
    loading: boolean,
    loaded: boolean,
    filter: string,
    wcFilter: string,
    filterInactive: boolean,
}

export const defaultListState: ListState = {
    list: [],
    selected: null,
    loading: false,
    loaded: false,
    filter: '',
    wcFilter: '',
    filterInactive: true,
}

export interface ActionInterfacePayload {
    list?: any[] | object,
    filter?: string,
    error?: Error,
    context?: string,
}

export type BillTypeDescriptions = {
    [key in BillType]: string;
};
export const BillTypeDesc: BillTypeDescriptions = {
    S: 'Standard',
    K: 'Kit',
    I: 'Inactive',
    P: 'Phantom',
    E: 'Engineering',
    M: 'MRP',
}

export interface BillHeaderList {
    [key: string]: BillHeader
}

export interface BillOptionHeaderList {
    [key: string]: BillOptionHeader
}

export interface DLSteps {
    [key: number]: DLBasicStep,
}

export interface DLCodeList {
    [key: number]: DLCode,
}


export interface DLStepTotal {
    standardAllowedMinutes: number,
    fixedCosts: number,
    stepCost: number,
}

export interface DLCodeSteps {
    [key: number]: DLCodeStep,
}

export type DLCodeField = keyof DLCode;
export type DLCodeStepField = keyof DLCodeStep;


export interface DLCodeTableField extends SortableTableField {
    field: DLCodeField,
}

export interface DLStepCodeTableField extends SortableTableField {
    field: DLCodeStepField,
}

export interface GLAccountList {
    [key: string]: GLAccount,
}


export interface OperationCodeSearchKey {
    workCenter: string,
    operationCode: string,
}

export interface OperationCodeList {
    [key: string]: OperationCode,
}

export type OperationCodeField = keyof OperationCode;


export interface OperationCodeTableField extends SortableTableField {
    field: OperationCodeField
}

export interface RoutingResponse {
    routingHeader: RoutingHeader[];
    routingDetail: RoutingDetail[];
    whereUsed: BillHeader[];
    whereUsedOption: BillOptionHeader[];
}


export interface RoutingHeaderList {
    [key: string]: RoutingHeader,
}


export interface RoutingDetailList {
    [key: string]: RoutingDetail;
}

export interface WorkCenterList {
    [key: string]: WorkCenter
}

export interface SaveTimingResponse {
    timings: StepTiming[];
    step: DLStep;
}

export interface FetchTimingArg {
    stepId: number;
    timingId?: number;
}
